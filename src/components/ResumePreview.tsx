'use client'
import useDimensions from '@/hooks/useDimensions'
import { ResumeLayouts } from './resume-layouts/ResumeLayouts'
import { ResumeStyles } from './resume-styles'
import { cn } from '@/lib/utils'
import { useRef, useState } from 'react'

export default function ResumePreview({
	resumeData,
	contentRef,
}: {
	resumeData: any
	contentRef?: React.Ref<HTMLDivElement>
}) {
	const containerRef = useRef<HTMLDivElement>(null)

	const { width } = useDimensions(containerRef)

	return (
		<div>
			<div className="aspect-[210/297] w-full flex-[100%] border" ref={containerRef}>
				{resumeData && (
					<div
						className={cn('h-full w-full space-y-6 overflow-y-scroll p-6 text-black', !width && 'invisible')}
						style={{
							zoom: (1 / 794) * width,
							backgroundColor: resumeData.bgColor,
						}}
						id="resumePreviewContent"
						ref={contentRef}
					>
						{ResumeLayouts[resumeData.selectedLayoutIndex].component({
							PersonalInfoHeader: ResumeStyles[resumeData.selectedStyleIndex].component.PersonalInfoHeader({
								resumeData,
							}),
							SummarySection: ResumeStyles[resumeData.selectedStyleIndex].component.SummarySection({ resumeData }),
							EducationSection: ResumeStyles[resumeData.selectedStyleIndex].component.EducationSection({
								resumeData,
							}),
							WorkExperienceSection: ResumeStyles[resumeData.selectedStyleIndex].component.WorkExperienceSection({
								resumeData,
							}),
							SkillsSection: ResumeStyles[resumeData.selectedStyleIndex].component.SkillsSection({ resumeData }),
						})}
					</div>
				)}
			</div>
		</div>
	)
}
