'use client'

import OneStepNavBar from '@/components/OneStepNavBar'
import ResumePreview from '@/components/ResumePreview'
import StepNavBar from '@/components/StepNavBar'
import { Resume, Hint } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect, useState, useCallback } from 'react'

export default function Page() {
	const params = useSearchParams()
	const resumeId = params.get('resumeId')
	const [resumeData, setResumeData] = useState<Resume | null>(null)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [hints, setHints] = useState<Hint[]>([])
	const [hintsLoading, setHintsLoading] = useState(false)

	// Hàm debounce tùy chỉnh
	const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
		let timeout: NodeJS.Timeout | null = null
		return (...args: Parameters<T>) => {
			if (timeout) clearTimeout(timeout)
			timeout = setTimeout(() => func(...args), wait)
		}
	}

	// Fetch resume data
	useEffect(() => {
		const fetchResume = async () => {
			if (!resumeId) return
			try {
				const response = await fetch(`/api/resume/${resumeId}`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				})
				if (response.ok) {
					const data: Resume = await response.json()
					setResumeData(data)
					setImagePreview(data.photoData || '')
				} else {
					console.error('Failed to fetch resume data')
				}
			} catch (error) {
				console.error('Error getting resume data:', error)
			}
		}
		fetchResume()
	}, [resumeId])

	// Fetch hints for generalInfo
	useEffect(() => {
		const fetchHints = async () => {
			if (!resumeId) return
			try {
				setHintsLoading(true)
				const response = await fetch(`/api/hints?resumeId=${resumeId}&part=generalInfo`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				})
				if (response.ok) {
					const data: Hint[] = await response.json()
					setHints(data)
				} else {
					console.error('Không thể tải gợi ý')
				}
			} catch (error) {
				console.error('Lỗi khi lấy gợi ý:', error)
			} finally {
				setHintsLoading(false)
			}
		}
		fetchHints()
	}, [resumeId])

	const handleDeleteHint = async (hintId: string) => {
		try {
			const response = await fetch(`/api/hints?hintId=${hintId}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			})
			if (response.ok) {
				setHints((prevHints) => prevHints.filter((hint) => hint.id !== hintId))
			} else {
				console.error('Không thể xóa gợi ý')
			}
		} catch (error) {
			console.error('Lỗi khi xóa gợi ý:', error)
		}
	}

	const handleUpdate = async (updatedData: Partial<Resume>) => {
		if (!resumeId) return
		try {
			const response = await fetch(`/api/resume/${resumeId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedData),
			})
			if (response.ok) {
				const updatedResume: Resume = await response.json()
				setResumeData(updatedResume)
			} else {
				throw new Error('Failed to update resume')
			}
		} catch (error) {
			console.error('Error updating resume:', error)
		}
	}

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				const base64String = reader.result as string
				setImagePreview(base64String)
				handleUpdate({ photoData: base64String })
			}
			reader.readAsDataURL(file)
		}
	}

	// Debounced handleUpdate
	const debouncedHandleUpdate = useCallback(debounce(handleUpdate, 300), [resumeId])

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setResumeData((prev) => (prev ? { ...prev, [name]: value } : prev))
		debouncedHandleUpdate({ [name]: value })
	}

	return (
		<div className="mb-8 grid grid-cols-1 lg:grid-cols-2">
			<div className="col-span-1">
				<StepNavBar stepName="generalInfo" resumeId={resumeId || ''} />

				{/* FORM BODY */}
				<div className="p-4">
					<div className="flex flex-col items-center">
						<div className="mb-4">
							{imagePreview && (
								<img src={imagePreview} alt="Ảnh đại diện" className="h-32 w-32 rounded-full object-cover" />
							)}
						</div>
						<div className="mb-4">
							<label
								htmlFor="image-upload"
								className="rounded bg-gray-800 px-2 py-1 text-white hover:cursor-pointer hover:bg-gray-600"
							>
								Tải ảnh lên
							</label>
							<input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
						</div>
					</div>
					<div className="grid grid-cols-4 gap-x-4 gap-y-1">
						<div className="col-span-1">
							<div>Họ</div>
							<input
								name="lastName"
								onChange={handleChange}
								defaultValue={resumeData?.lastName}
								className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
							/>
						</div>
						<div className="col-span-1">
							<div>Tên</div>
							<input
								name="firstName"
								onChange={handleChange}
								defaultValue={resumeData?.firstName}
								className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
							/>
						</div>
						<div className="col-span-1">
							<div>SĐT</div>
							<input
								name="phone"
								onChange={handleChange}
								defaultValue={resumeData?.phone}
								className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
							/>
						</div>
						<div className="col-span-1">
							<div>Email</div>
							<input
								name="email"
								onChange={handleChange}
								defaultValue={resumeData?.email}
								className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
							/>
						</div>
						<div className="col-span-1">
							<div>Thành phố</div>
							<input
								name="city"
								onChange={handleChange}
								defaultValue={resumeData?.city}
								className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
							/>
						</div>
						<div className="col-span-1">
							<div>Quốc gia</div>
							<input
								name="country"
								onChange={handleChange}
								defaultValue={resumeData?.country}
								className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
							/>
						</div>
						<div className="col-span-1">
							<div>Công việc</div>
							<input
								name="jobTitle"
								onChange={handleChange}
								defaultValue={resumeData?.jobTitle}
								className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
							/>
						</div>
					</div>
				</div>

				{/* Hints Section */}
				<div className="p-4">
					<h2 className="mb-4 text-lg font-semibold text-gray-800">Gợi ý cải thiện thông tin chung</h2>
					{hintsLoading ? (
						// Skeleton Loading
						Array(3)
							.fill(0)
							.map((_, index) => (
								<div
									key={index}
									className="mb-3 flex animate-pulse items-center justify-between rounded-lg bg-gray-200 p-3"
								>
									<div className="h-6 w-3/4 rounded bg-gray-300"></div>
								</div>
							))
					) : hints.length > 0 ? (
						<div className="max-h-64 space-y-3 overflow-y-auto">
							{hints.map((hint) => (
								<div
									key={hint.id}
									className={`rounded-lg p-3 ${
										hint.type === 'success'
											? 'border border-green-400 bg-green-100'
											: 'border border-yellow-400 bg-yellow-100'
									}`}
								>
									<div className="flex items-center justify-between">
										<span className="font-medium text-gray-800">Thông tin chung</span>
										<div className="flex items-center space-x-2">
											<span
												className={`text-sm font-semibold ${
													hint.type === 'success' ? 'text-green-600' : 'text-yellow-600'
												}`}
											>
												{hint.type === 'success' ? 'Thành công' : 'Gợi ý chỉnh sửa'}
											</span>
											<button
												onClick={() => handleDeleteHint(hint.id)}
												className="rounded-md bg-red-600 px-2 py-1 text-sm font-medium text-white hover:bg-red-700"
											>
												Ẩn đi
											</button>
										</div>
									</div>
									<p className="mt-2 text-gray-600">{hint.content}</p>
								</div>
							))}
						</div>
					) : (
						<div className="text-center text-gray-500">Chưa có gợi ý nào cho thông tin chung</div>
					)}
				</div>

				<OneStepNavBar
					linkPrev={`/editor/themes?resumeId=${resumeId}`}
					linkNext={`/editor/education?resumeId=${resumeId}`}
				/>
			</div>
			<div className="col-span-1 mx-10 flex h-full flex-col">
				<ResumePreview resumeData={resumeData} />
			</div>
		</div>
	)
}
