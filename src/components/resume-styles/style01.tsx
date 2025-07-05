'use client'
import { formatDate, isValidDate } from '@/lib/utils'
import Image from 'next/image'

export default function PersonalInfoHeader({ resumeData }: { resumeData: any }) {
	if (!resumeData) {
		return <div>Thiếu dữ liệu resume hoặc colors</div>
	}

	return (
		<div
			className="flex items-center gap-6"
			style={{
				backgroundColor: resumeData.bgColor,
				padding: '1rem',
				fontFamily: resumeData.fontFamily || 'Arial',
			}}
		>
			{resumeData.photoUrl && (
				<Image
					src={resumeData.photoUrl}
					width={100}
					height={100}
					alt="Author photo"
					className="aspect-square object-cover"
				/>
			)}
			{resumeData.photoData && (
				<Image
					src={resumeData.photoData}
					width={100}
					height={100}
					alt="Author photo"
					className="aspect-square object-cover"
				/>
			)}

			{(resumeData.firstName ||
				resumeData.lastName ||
				resumeData.jobTitle ||
				resumeData.city ||
				resumeData.country ||
				resumeData.phone ||
				resumeData.email) && (
				<div className="space-y-2.5">
					{(resumeData.firstName || resumeData.lastName || resumeData.jobTitle) && (
						<div className="space-y-1">
							{(resumeData.firstName || resumeData.lastName) && (
								<p className="text-3xl font-bold" style={{ color: resumeData.primaryColor }}>
									{resumeData.firstName || ''} {resumeData.lastName || ''}
								</p>
							)}
							{resumeData.jobTitle && (
								<p className="font-medium" style={{ color: resumeData.secondaryColor }}>
									{resumeData.jobTitle}
								</p>
							)}
						</div>
					)}
					{(resumeData.city || resumeData.country || resumeData.phone || resumeData.email) && (
						<p className="text-xs" style={{ color: resumeData.textColor }}>
							{resumeData.city || ''}
							{resumeData.city && resumeData.country ? ', ' : ''}
							{resumeData.country || ''}
							{(resumeData.city || resumeData.country) && (resumeData.phone || resumeData.email) ? ' • ' : ''}
							{[resumeData.phone, resumeData.email].filter(Boolean).join(' • ')}
						</p>
					)}
				</div>
			)}
		</div>
	)
}

function SummarySection({ resumeData }: { resumeData: any }) {
	if (!resumeData) {
		return <div>Thiếu dữ liệu resume hoặc colors</div>
	}

	if (!resumeData.summary) {
		return null
	}

	return (
		<div
			className="break-inside-avoid space-y-3"
			style={{
				backgroundColor: resumeData.bgColor,
				padding: '1rem',
				fontFamily: resumeData.fontFamily || 'Arial',
			}}
		>
			<p className="text-lg font-semibold" style={{ color: resumeData.primaryColor }}>
				Tổng quan
			</p>
			<div className="text-sm whitespace-pre-line" style={{ color: resumeData.textColor }}>
				{resumeData.summary}
			</div>
		</div>
	)
}

function WorkExperienceSection({ resumeData }: { resumeData: any }) {
	if (!resumeData) {
		return null
	}

	const workExperiencesNotEmpty = resumeData.workExperiences?.filter(
		(exp: any) => exp.position || exp.company || exp.description || (exp.startDate && isValidDate(exp.startDate)),
	)

	if (!workExperiencesNotEmpty?.length) {
		return null
	}

	return (
		<div
			className="space-y-3"
			style={{
				backgroundColor: resumeData.bgColor,
				padding: '1rem',
				fontFamily: resumeData.fontFamily || 'Arial',
			}}
		>
			<p className="text-lg font-semibold" style={{ color: resumeData.primaryColor }}>
				Work experience
			</p>
			{workExperiencesNotEmpty.map((exp: any, index: any) => (
				<div key={index} className="break-inside-avoid space-y-1">
					{(exp.position || (exp.startDate && isValidDate(exp.startDate))) && (
						<div className="flex items-center justify-between text-sm font-semibold">
							{exp.position && <span style={{ color: resumeData.secondaryColor }}>{exp.position}</span>}
							{exp.startDate && isValidDate(exp.startDate) && (
								<span style={{ color: resumeData.textColor }}>
									{formatDate(exp.startDate, 'MM/yyyy')} -{' '}
									{exp.endDate && isValidDate(exp.endDate) ? formatDate(exp.endDate, 'MM/yyyy') : 'Present'}
								</span>
							)}
						</div>
					)}
					{exp.company && (
						<p className="text-xs font-semibold" style={{ color: resumeData.secondaryColor }}>
							{exp.company}
						</p>
					)}
					{exp.description && (
						<div className="text-xs whitespace-pre-line" style={{ color: resumeData.textColor }}>
							{exp.description}
						</div>
					)}
				</div>
			))}
		</div>
	)
}

function EducationSection({ resumeData }: { resumeData: any }) {
	if (!resumeData) {
		return null
	}

	const educationsNotEmpty = resumeData.educations?.filter(
		(edu: any) => edu.degree || edu.institution || (edu.startDate && isValidDate(edu.startDate)),
	)

	if (!educationsNotEmpty?.length) {
		return null
	}

	return (
		<div
			className="space-y-3"
			style={{
				backgroundColor: resumeData.bgColor,
				padding: '1rem',
				fontFamily: resumeData.fontFamily || 'Arial',
			}}
		>
			<p className="text-lg font-semibold" style={{ color: resumeData.primaryColor }}>
				Education
			</p>
			{educationsNotEmpty.map((edu: any, index: any) => (
				<div key={index} className="break-inside-avoid space-y-1">
					{(edu.degree || (edu.startDate && isValidDate(edu.startDate))) && (
						<div className="flex items-center justify-between text-sm font-semibold">
							{edu.degree && <span style={{ color: resumeData.secondaryColor }}>{edu.degree}</span>}
							{edu.startDate && isValidDate(edu.startDate) && (
								<span style={{ color: resumeData.textColor }}>
									{formatDate(edu.startDate, 'MM/yyyy')}
									{edu.endDate && isValidDate(edu.endDate) ? ` - ${formatDate(edu.endDate, 'MM/yyyy')}` : ''}
								</span>
							)}
						</div>
					)}
					{edu.institution && (
						<p className="text-xs font-semibold" style={{ color: resumeData.secondaryColor }}>
							{edu.institution}
						</p>
					)}
				</div>
			))}
		</div>
	)
}

function SkillsSection({ resumeData }: { resumeData: any }) {
	if (!resumeData) {
		return <div>Thiếu dữ liệu resume hoặc colors</div>
	}

	if (!resumeData.skills?.length) {
		return null
	}

	return (
		<div
			className="break-inside-avoid space-y-3"
			style={{
				backgroundColor: resumeData.bgColor,
				padding: '1rem',
				fontFamily: resumeData.fontFamily || 'Arial',
			}}
		>
			<p className="text-lg font-semibold" style={{ color: resumeData.primaryColor }}>
				Skills
			</p>
			<div className="flex break-inside-avoid flex-wrap gap-2">
				{resumeData.skills.map((skill: any, index: any) => (
					<div key={index} style={{ color: resumeData.textColor }}>
						{skill}
					</div>
				))}
			</div>
		</div>
	)
}

export const Style01 = {
	PersonalInfoHeader,
	SkillsSection,
	EducationSection,
	WorkExperienceSection,
	SummarySection,
}
