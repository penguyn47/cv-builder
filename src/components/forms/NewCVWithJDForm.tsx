'use client'

import { useActionState, useEffect } from 'react'
import InputField from '../InputField'
import { createResumeWithJD } from '@/lib/actions'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function NewCVWithJDForm() {
	const [state, formAction] = useActionState(createResumeWithJD, {
		success: false,
		error: false,
		data: { id: '' },
	})

	const router = useRouter()

	useEffect(() => {
		if (state.success) {
			toast.info('Thêm mới CV thành công, tiếp tục tùy chỉnh')
			router.push(`/editor/themes?resumeId=${state.data.id}`)
		}
	}, [state])

	return (
		<div className="flex flex-col gap-4">
			<div className="text-xl font-semibold underline">Thông tin chung của CV:</div>
			<form action={formAction} className="flex flex-col gap-4">
				<InputField name="title" label="Tên CV" />
				<InputField name="description" label="Mô tả (JD) - Sử dụng AI để tự động hóa tạo CV" type="textarea" />
				<button
					className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:cursor-pointer hover:bg-gray-700"
					type="submit"
				>
					Tạo CV mới
				</button>
			</form>
		</div>
	)
}
