'use client'

import { useActionState, useEffect } from 'react'
import InputField from '../InputField'
import { createResume } from '@/lib/actions'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function NewCVForm() {
	const [state, formAction] = useActionState(createResume, {
		success: false,
		error: false,
	})

	const router = useRouter()

	useEffect(() => {
		if (state.success) {
			toast.info('Thêm mới CV thành công, tiếp tục tùy chỉnh')
			router.push('/editor/themes')
		}
	}, [state])

	return (
		<div className="flex flex-col gap-4">
			<div className="text-xl font-semibold underline">Thông tin chung của CV:</div>
			<form action={formAction} className="flex flex-col gap-4">
				<InputField name="title" label="Tên CV" />
				<InputField name="description" label="Mô tả" />
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
