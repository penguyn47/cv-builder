import { cn } from '@/lib/utils'
import Link from 'next/link'
import { TiChevronRightOutline } from 'react-icons/ti'

export default function StepNavBar({ resumeId, stepName }: { resumeId: string; stepName: string }) {
	const stepList = [
		{
			label: 'Giao diện',
			stepName: 'style',
			link: `/editor/themes?resumeId=${resumeId}`,
		},
		{
			label: 'Thông tin chung',
			stepName: 'generalInfo',
			link: `/editor/generalInfo?resumeId=${resumeId}`,
		},
		{
			label: 'Học vấn',
			stepName: 'education',
			link: `/editor/education?resumeId=${resumeId}`,
		},
		{
			label: 'Kinh nghiệm',
			stepName: 'experience',
			link: `/editor/experience?resumeId=${resumeId}`,
		},
		{
			label: 'Kỹ năng',
			stepName: 'skill',
			link: `/editor/skill?resumeId=${resumeId}`,
		},
		{
			label: 'Tổng kết',
			stepName: 'summary',
			link: `/editor/summary?resumeId=${resumeId}`,
		},
	]
	return (
		<div className="my-4 flex flex-wrap items-center justify-center gap-4 bg-gray-200 py-2">
			{stepList.map((item: { label: string; stepName: string; link: string }, index: number) => (
				<div key={index} className="flex items-center justify-center gap-2">
					<Link href={item.link}>
						<div
							className={cn(
								'font-semibold uppercase',
								stepName === item.stepName ? 'text-gray-900' : 'text-gray-400 hover:cursor-pointer hover:text-gray-700',
							)}
						>
							{item.label}
						</div>
					</Link>
				</div>
			))}
		</div>
	)
}
