'use client'
import { cn, formatDate, isValidDate } from '@/lib/utils'
import Image from 'next/image'

type Colors = {
	bgColor: string
	primaryColor: string
	secondaryColor: string
	textColor: string
}

function PersonalInfoHeader({ resumeData }: { resumeData: any }) {
	if (!resumeData) {
		return <div>Thiếu dữ liệu resume hoặc colors</div>
	}

	return (
		<div
			className="flex items-center gap-6 rounded-xl p-4"
			style={{
				backgroundColor: resumeData.primaryColor,
				fontFamily: resumeData.fontFamily || 'Arial',
			}}
		>
			{resumeData.photoUrl && (
				<Image
					src={resumeData.photoUrl}
					width={150}
					height={150}
					alt="Author photo"
					className="aspect-square rounded-full border-2 border-white object-cover"
				/>
			)}
			{resumeData.photoData && (
				<Image
					src={resumeData.photoData}
					width={150}
					height={150}
					alt="Author photo"
					className="aspect-square rounded-full border-2 border-white object-cover"
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
								<p className="text-3xl font-bold" style={{ color: 'white' }}>
									{resumeData.firstName || ''} {resumeData.lastName || ''}
								</p>
							)}
							{resumeData.jobTitle && (
								<p className="font-medium" style={{ color: 'white' }}>
									{resumeData.jobTitle}
								</p>
							)}
						</div>
					)}
					{(resumeData.city || resumeData.country || resumeData.phone || resumeData.email) && (
						<p className="text-xs" style={{ color: 'white' }}>
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
			className="flex break-inside-avoid flex-col items-center space-y-3"
			style={{ fontFamily: resumeData.fontFamily || 'Arial' }}
		>
			<p
				className="rounded-sm px-2 py-1 text-center text-xl font-semibold"
				style={{
					backgroundColor: resumeData.secondaryColor,
					color: 'white',
				}}
			>
				Giới thiệu chung
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
		<div className="flex flex-col items-center space-y-3" style={{ fontFamily: resumeData.fontFamily || 'Arial' }}>
			<p
				className="rounded-sm px-2 py-1 text-center text-xl font-semibold"
				style={{
					backgroundColor: resumeData.secondaryColor,
					color: 'white',
				}}
			>
				Kinh nghiệm
			</p>
			{workExperiencesNotEmpty.map((exp: any, index: any) => (
				<div key={index} className="w-full break-inside-avoid space-y-1">
					{(exp.position || (exp.startDate && isValidDate(exp.startDate))) && (
						<div className="flex items-center justify-between text-sm font-semibold">
							{exp.position && (
								<span style={{ color: resumeData.textColor }} className="text-xl">
									{exp.position}
								</span>
							)}
							{exp.startDate && isValidDate(exp.startDate) && (
								<span style={{ color: resumeData.textColor }}>
									{formatDate(exp.startDate, 'MM/yyyy')} -{' '}
									{exp.endDate && isValidDate(exp.endDate) ? formatDate(exp.endDate, 'MM/yyyy') : 'Present'}
								</span>
							)}
						</div>
					)}
					{exp.company && (
						<p className="text-xs font-semibold" style={{ color: resumeData.textColor }}>
							{exp.company}
						</p>
					)}
					{exp.description && (
						<div className="w-full text-xs wrap-anywhere whitespace-pre-line" style={{ color: resumeData.textColor }}>
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
		<div className="flex flex-col items-center space-y-3" style={{ fontFamily: resumeData.fontFamily || 'Arial' }}>
			<p
				className="rounded-sm px-2 py-1 text-center text-xl font-semibold"
				style={{
					backgroundColor: resumeData.secondaryColor,
					color: 'white',
				}}
			>
				Học vấn
			</p>
			{educationsNotEmpty.map((edu: any, index: any) => (
				<div key={index} className="w-full break-inside-avoid space-y-1">
					{(edu.degree || (edu.startDate && isValidDate(edu.startDate))) && (
						<div className="flex items-center justify-between text-sm font-semibold">
							{edu.degree && (
								<span className="text-lg" style={{ color: resumeData.textColor }}>
									{edu.degree}
								</span>
							)}
							{edu.startDate && isValidDate(edu.startDate) && (
								<span style={{ color: resumeData.textColor }}>
									{formatDate(edu.startDate, 'MM/yyyy')}
									{edu.endDate && isValidDate(edu.endDate) ? ` - ${formatDate(edu.endDate, 'MM/yyyy')}` : ''}
								</span>
							)}
						</div>
					)}
					{edu.institution && (
						<p className="text-xs font-semibold" style={{ color: resumeData.textColor }}>
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
			className="flex break-inside-avoid flex-col items-center space-y-3"
			style={{ fontFamily: resumeData.fontFamily || 'Arial' }}
		>
			<p
				className="rounded-sm px-2 py-1 text-center text-xl font-semibold"
				style={{
					backgroundColor: resumeData.secondaryColor,
					color: 'white',
				}}
			>
				Các kỹ năng
			</p>
			<div className="flex break-inside-avoid flex-wrap gap-2">
				{resumeData.skills.map((skill: any, index: any) => (
					<div
						key={index}
						className="rounded-sm p-1 text-sm"
						style={{ backgroundColor: resumeData.bgColor, color: resumeData.textColor }}
					>
						{skill}
					</div>
				))}
			</div>
		</div>
	)
}

export const Style02 = {
	PersonalInfoHeader,
	SkillsSection,
	EducationSection,
	WorkExperienceSection,
	SummarySection,
}
