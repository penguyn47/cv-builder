'use client'

import OneStepNavBar from '@/components/OneStepNavBar'
import { ResumeLayouts } from '@/components/resume-layouts/ResumeLayouts'
import { ResumeStyles } from '@/components/resume-styles'
import ResumePreview from '@/components/ResumePreview'
import StepNavBar from '@/components/StepNavBar'
import { dummy } from '@/lib/resume-dummy'
import { Resume } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Select from 'react-select'

const fontOptions = [
	{ value: 'Arial, sans-serif', label: 'Arial' },
	{ value: 'Times New Roman, serif', label: 'Times New Roman' },
	{ value: 'Georgia, serif', label: 'Georgia' },
	{ value: 'Courier New, monospace', label: 'Courier New' },
	{ value: 'Verdana, sans-serif', label: 'Verdana' },
	{ value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
	{ value: 'Palatino, serif', label: 'Palatino' },
]

const defaultResumeTheme = {
	bgColor: '#FFFFFF',
	primaryColor: '#444444',
	secondaryColor: '#777777',
	textColor: '#000000',
	fontFamily: 'Arial',
	selectedLayoutIndex: 0,
	selectedStyleIndex: 0,
}

export default function Page() {
	const params = useSearchParams()

	const resumeId = params.get('resumeId')

	const [resumeData, setResumeData] = useState<Resume | null>(null)

	const [bgColor, setBgColor] = useState(defaultResumeTheme.bgColor)
	const [primaryColor, setPrimaryColor] = useState(defaultResumeTheme.primaryColor)
	const [secondaryColor, setSecondaryColor] = useState(defaultResumeTheme.secondaryColor)
	const [textColor, setTextColor] = useState(defaultResumeTheme.textColor)
	const [fontFamily, setFontFamily] = useState(defaultResumeTheme.fontFamily)
	const [selectedLayout, setSelectedLayout] = useState(defaultResumeTheme.selectedLayoutIndex)
	const [selectedStyle, setSelectedStyle] = useState(defaultResumeTheme.selectedStyleIndex)

	useEffect(() => {
		const fetchResume = async () => {
			if (!resumeId) return
			try {
				const response = await fetch(`/api/resume/${resumeId}`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				})
				if (response.ok) {
					const data: Resume = await response.json()
					setResumeData(data)
					setBgColor(data.bgColor || defaultResumeTheme.bgColor)
					setPrimaryColor(data.primaryColor || defaultResumeTheme.primaryColor)
					setSecondaryColor(data.secondaryColor || defaultResumeTheme.secondaryColor)
					setTextColor(data.textColor || defaultResumeTheme.textColor)
					setFontFamily(data.fontFamily || defaultResumeTheme.fontFamily)
					setSelectedLayout(data.selectedLayoutIndex || defaultResumeTheme.selectedLayoutIndex)
					setSelectedStyle(data.selectedStyleIndex || defaultResumeTheme.selectedStyleIndex)
				} else {
					console.error('Failed to fetch resume data')
				}
			} catch (error) {
				console.error('Error getting resume data:', error)
			}
		}
		fetchResume()
	}, [resumeId])

	const handleUpdate = async (updatedData: Partial<Resume>) => {
		try {
			const response = await fetch(`/api/resume/${resumeId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedData),
			})
			if (!response.ok) {
				throw new Error('Failed to update resume')
			}
		} catch (error) {
			console.error('Error updating resume:', error)
		}
	}

	return (
		<div className="mb-8 grid grid-cols-1 lg:grid-cols-2">
			<div className="col-span-1">
				<StepNavBar stepName="style" resumeId={resumeId || ''} />
				<div className="flex justify-center text-xl font-bold uppercase">Tùy chỉnh thiết kế cho hồ sơ</div>
				<div className="flex flex-col justify-center">
					<div className="my-2 ml-4 flex justify-start font-semibold">Khung thiết kế</div>
					<div className="grid grid-cols-6 px-8">
						{ResumeLayouts.map((item, index) => (
							<div
								key={index}
								className="w-[100px] hover:cursor-pointer hover:bg-gray-300"
								onClick={() => {
									setSelectedLayout(index)
									handleUpdate({ selectedLayoutIndex: index })
								}}
							>
								{item.preview}
							</div>
						))}
					</div>
				</div>
				<div className="flex flex-col justify-center">
					<div className="my-2 ml-4 flex justify-start font-semibold">Phong cách</div>
					<div className="mx-8 grid grid-cols-6 gap-2">
						{ResumeStyles.map((item, index) => (
							<div
								key={index}
								className="flex items-center justify-center rounded bg-gray-800 py-1 text-center font-semibold text-white hover:cursor-pointer hover:bg-gray-700"
								onClick={() => {
									setSelectedStyle(index)
									handleUpdate({ selectedStyleIndex: index })
								}}
							>
								{item.header}
							</div>
						))}
					</div>
				</div>
				<div className="flex flex-col justify-center">
					<div className="my-2 ml-4 flex justify-start font-semibold">Màu sắc</div>
					<div className="mx-8 flex gap-2">
						<div className="flex items-center justify-center gap-2">
							<div>Màu nền:</div>
							<input
								type="color"
								value={bgColor}
								onBlur={(e) => handleUpdate({ bgColor: e.target.value })}
								onChange={(e) => {
									setBgColor(e.target.value)
								}}
								className="h-10 w-10 cursor-pointer rounded border-1 p-1"
							/>
						</div>
						<div className="flex items-center justify-center gap-2">
							<div>Màu chủ đạo:</div>
							<input
								type="color"
								value={primaryColor}
								onBlur={(e) => handleUpdate({ primaryColor: e.target.value })}
								onChange={(e) => {
									setPrimaryColor(e.target.value)
								}}
								className="h-10 w-10 cursor-pointer rounded border-1 p-1"
							/>
						</div>
						<div className="flex items-center justify-center gap-2">
							<div>Màu phụ đạo:</div>
							<input
								type="color"
								value={secondaryColor}
								onBlur={(e) => handleUpdate({ secondaryColor: e.target.value })}
								onChange={(e) => {
									setSecondaryColor(e.target.value)
								}}
								className="h-10 w-10 cursor-pointer rounded border border-gray-300 p-1"
							/>
						</div>
						<div className="flex items-center justify-center gap-2">
							<div>Màu chữ:</div>
							<input
								type="color"
								value={textColor}
								onBlur={(e) => handleUpdate({ textColor: e.target.value })}
								onChange={(e) => {
									setTextColor(e.target.value)
								}}
								className="h-10 w-10 cursor-pointer rounded border border-gray-300 p-1"
							/>
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-center">
					<div className="my-2 ml-4 flex justify-start font-semibold">Phông chữ</div>
					<Select
						className="mx-8 w-[50%] border"
						name="fonts"
						options={fontOptions}
						value={fontOptions.find((option) => option.value === fontFamily)}
						onChange={(selectedOption) => {
							setFontFamily(selectedOption?.value || 'Arial')
							handleUpdate({ fontFamily: selectedOption?.value || 'Arial' })
						}}
						classNamePrefix="select"
						instanceId="font-select"
					/>
				</div>
				<OneStepNavBar isPrevDisable={true} linkPrev="/" linkNext={`/editor/generalInfo?resumeId=${resumeId}`} />
			</div>
			<div className="col-span-1 mx-10 flex h-full flex-col">
				<ResumePreview
					resumeData={{
						...dummy,
						fontFamily,
						selectedLayoutIndex: selectedLayout,
						selectedStyleIndex: selectedStyle,
						bgColor,
						primaryColor,
						secondaryColor,
						textColor,
					}}
				/>
			</div>
		</div>
	)
}
