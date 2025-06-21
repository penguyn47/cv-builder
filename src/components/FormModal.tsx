import { IoMdClose } from 'react-icons/io'

import NewCVForm from '@/components/forms/NewCVForm'
import { cn } from '@/lib/utils'

interface FormModalProps {
	isOpen: boolean
	onClose: () => void
	formName: string
	fullScreen?: boolean
}

const getFormContent = (formName: string) => {
	switch (formName.toLowerCase()) {
		case 'newcv':
			return <NewCVForm />
		default:
			return <p className="text-red-500">Form không tồn tại!</p>
	}
}

export default function FormModal({ isOpen, onClose, formName, fullScreen }: FormModalProps) {
	if (!isOpen) return null
	return (
		<div
			className={cn(
				'inset-0 z-50 flex items-center justify-center bg-black/50',
				fullScreen == true ? 'fixed' : 'absolute',
			)}
		>
			<div className="relative m-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
				{/* Nút đóng modal */}
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-2xl text-gray-500 hover:cursor-pointer hover:text-gray-700"
				>
					<IoMdClose />
				</button>
				{/* FORM */}
				{getFormContent(formName)}
			</div>
		</div>
	)
}
