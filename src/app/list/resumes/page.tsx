'use client'
import { IoDocumentTextOutline } from 'react-icons/io5'

import { useState } from 'react'
import FormModal from '@/components/FormModal'

export default function ResumeListPage() {
	const [openModal, setOpenModal] = useState(false)

	return (
		<div>
			<div>
				<div
					onClick={() => setOpenModal(true)}
					className="flex w-fit items-center gap-2 rounded-xl bg-gray-800 px-3 py-2 text-lg font-semibold text-white hover:cursor-pointer hover:bg-gray-700"
				>
					<IoDocumentTextOutline />
					Tạo CV mới
				</div>
				<FormModal isOpen={openModal} onClose={() => setOpenModal(false)} formName="newcv" fullScreen={true} />
			</div>
		</div>
	)
}
