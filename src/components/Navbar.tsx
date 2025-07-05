import Link from 'next/link'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { FaUser } from 'react-icons/fa'
import { IoDocuments } from 'react-icons/io5'
import { FaRobot } from 'react-icons/fa'

export default function Navbar() {
	return (
		<div className="fixed top-0 left-0 z-50 w-full border-b-3 border-gray-300 bg-white px-4 py-2 shadow-md">
			<div className="mx-auto flex max-w-7xl items-center justify-between">
				{/* PAGE ICON SECTION */}
				<Link className="hover:text-gray-400" href="/">
					<div className="flex items-center justify-between gap-2">
						<IoDocumentTextOutline className="text-3xl" />
						<div className="text-xl font-bold">CV Pro</div>
					</div>
				</Link>

				{/* NAV ITEMS SECTION */}
				<div>
					<ul className="flex justify-between gap-2 text-2xl">
						<li>
							<Link
								className="flex items-center justify-center rounded-lg border px-2 py-1 text-gray-800 hover:text-gray-400"
								href="/profile"
							>
								<FaUser />
							</Link>
						</li>
						<li>
							<Link
								className="flex items-center justify-center rounded-lg border px-2 py-1 text-gray-800 hover:text-gray-400"
								href="/list/resumes"
							>
								<IoDocuments />
							</Link>
						</li>
						<li>
							<Link
								className="flex items-center justify-center rounded-lg border px-2 py-1 text-gray-800 hover:text-gray-400"
								href="/bot-evaluate"
							>
								<FaRobot />
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
