import { ReactNode } from 'react'

function Layout01({
	PersonalInfoHeader,
	SummarySection,
	WorkExperienceSection,
	EducationSection,
	SkillsSection,
}: {
	PersonalInfoHeader: ReactNode
	SkillsSection: ReactNode
	EducationSection: ReactNode
	WorkExperienceSection: ReactNode
	SummarySection: ReactNode
}) {
	return (
		<div className="flex h-full flex-col gap-2">
			{PersonalInfoHeader}
			<hr className="border" />
			{SummarySection}
			<hr className="border" />
			{EducationSection}
			<hr className="border" />
			{WorkExperienceSection}
			<hr className="border" />
			{SkillsSection}
		</div>
	)
}

function Layout02({
	PersonalInfoHeader,
	SummarySection,
	WorkExperienceSection,
	EducationSection,
	SkillsSection,
}: {
	PersonalInfoHeader: ReactNode
	SkillsSection: ReactNode
	EducationSection: ReactNode
	WorkExperienceSection: ReactNode
	SummarySection: ReactNode
}) {
	return (
		<div className="flex h-full flex-col gap-2">
			{PersonalInfoHeader}
			<hr className="border" />
			{SummarySection}
			<hr className="border" />
			<div className="flex flex-1 gap-2">
				<div className="flex-1/3 border-r-2 px-2 py-2">{SkillsSection}</div>
				<div className="flex flex-2/3 flex-col gap-4 p-2">
					{EducationSection}
					<hr className="border" />
					{WorkExperienceSection}
				</div>
			</div>
		</div>
	)
}

function Layout03({
	PersonalInfoHeader,
	SummarySection,
	WorkExperienceSection,
	EducationSection,
	SkillsSection,
}: {
	PersonalInfoHeader: ReactNode
	SkillsSection: ReactNode
	EducationSection: ReactNode
	WorkExperienceSection: ReactNode
	SummarySection: ReactNode
}) {
	return (
		<div className="flex h-full flex-col gap-2">
			{PersonalInfoHeader}
			<hr className="border" />
			{SummarySection}
			<hr className="border" />
			<div className="flex flex-1 gap-2">
				<div className="flex flex-2/3 flex-col gap-4 p-2">
					{EducationSection}
					<hr className="border" />
					{WorkExperienceSection}
				</div>
				<div className="flex-1/3 border-l-2 px-2 py-2">{SkillsSection}</div>
			</div>
		</div>
	)
}

function Layout04({
	PersonalInfoHeader,
	SummarySection,
	WorkExperienceSection,
	EducationSection,
	SkillsSection,
}: {
	PersonalInfoHeader: ReactNode
	SkillsSection: ReactNode
	EducationSection: ReactNode
	WorkExperienceSection: ReactNode
	SummarySection: ReactNode
}) {
	return (
		<div className="flex h-full gap-2">
			<div className="flex flex-1/2 flex-col gap-4 border-r-2 p-2">
				{PersonalInfoHeader}
				<hr className="border" />
				{SummarySection}
				<hr className="border" />
				{EducationSection}
			</div>
			<div className="flex flex-1/2 flex-col gap-4 p-2">
				{WorkExperienceSection}
				<hr className="border" />
				{SkillsSection}
			</div>
		</div>
	)
}

export const ResumeLayouts = [
	{
		title: 'Một cột',
		component: Layout01,
		preview: (
			<div>
				<div className="aspect-[210/297] h-fit w-full border">
					<hr className="mt-6" />
					<hr className="mt-6" />
					<hr className="mt-6" />
					<hr className="mt-6" />
				</div>
			</div>
		),
	},
	{
		title: 'Hiện đại',
		component: Layout02,
		preview: (
			<div>
				<div className="flex aspect-[210/297] h-fit w-full flex-col border">
					<hr className="mt-6" />
					<div className="flex flex-1">
						<div className="flex-1/3 border-r"></div>
						<div className="flex-2/3"></div>
					</div>
				</div>
			</div>
		),
	},
	{
		title: 'Hiện đại Reverse',
		component: Layout03,
		preview: (
			<div>
				<div className="flex aspect-[210/297] h-fit w-full flex-col border">
					<hr className="mt-6" />
					<div className="flex flex-1">
						<div className="flex-2/3 border-r"></div>
						<div className="flex-1/3"></div>
					</div>
				</div>
			</div>
		),
	},
	{
		title: 'Hai cột',
		component: Layout04,
		preview: (
			<div>
				<div className="flex aspect-[210/297] h-fit w-full border">
					<div className="flex-1/2 border-r"></div>
					<div className="flex-1/2"></div>
				</div>
			</div>
		),
	},
]
