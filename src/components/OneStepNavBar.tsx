import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function OneStepNavBar({
	isNextDisable,
	isPrevDisable,
	linkPrev,
	linkNext,
}: {
	isNextDisable?: boolean
	isPrevDisable?: boolean
	linkPrev: string
	linkNext: string
}) {
	return (
		<div className="mt-8 flex items-center justify-between bg-gray-200 px-2 py-2">
			<div
				className={cn(
					'rounded bg-gray-800 px-2 py-1 text-lg text-white',
					isPrevDisable && 'bg-gray-500 hover:cursor-not-allowed',
				)}
			>
				<Link href={linkPrev}>Trở về</Link>
			</div>
			<div
				className={cn(
					'rounded bg-gray-800 px-2 py-1 text-lg text-white',
					isNextDisable && 'bg-gray-500 hover:cursor-not-allowed',
				)}
			>
				<Link href={linkNext}>Bước tiếp theo</Link>
			</div>
		</div>
	)
}
