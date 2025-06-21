import Link from 'next/link'
import { IoDocumentTextOutline } from 'react-icons/io5'

export default function Navbar() {
	return (
		<div className="flex justify-between border-b-3 border-gray-300 px-8 py-4">
			{/* PAGE ICON SECTION */}
			<Link className="hover:text-gray-400" href="/">
				<div className="flex items-center justify-between gap-2">
					<IoDocumentTextOutline className="text-3xl" />
					<div className="text-xl font-bold">CV Pro</div>
				</div>
			</Link>

			{/* NAV ITEMS SECTION */}
			<div>
				<ul className="flex justify-between gap-6 text-xl">
					<li>
						<Link className="hover:text-gray-400" href="/">
							Trang chủ
						</Link>
					</li>
					<li>
						<Link className="hover:text-gray-400" href="/list/resumes">
							Danh sách CV
						</Link>
					</li>
				</ul>
			</div>
		</div>
	)
}
