'use client'

import OneStepNavBar from '@/components/OneStepNavBar'
import ResumePreview from '@/components/ResumePreview'
import StepNavBar from '@/components/StepNavBar'
import { Education, Resume, Hint } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { FaUserGraduate } from 'react-icons/fa'
import { v4 } from 'uuid'

export default function Page() {
	const params = useSearchParams()
	const resumeId = params.get('resumeId')
	const [resumeData, setResumeData] = useState<Resume | null>(null)
	const [educations, setEducations] = useState<Education[]>([])
	const [pendingUpdate, setPendingUpdate] = useState<Partial<Resume> | null>(null)
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
					setEducations(data.educations || [])
				} else {
					console.error('Failed to fetch resume data')
				}
			} catch (error) {
				console.error('Error getting resume data:', error)
			}
		}
		fetchResume()
	}, [resumeId])

	// Fetch hints for education
	useEffect(() => {
		const fetchHints = async () => {
			if (!resumeId) return
			try {
				setHintsLoading(true)
				const response = await fetch(`/api/hints?resumeId=${resumeId}&part=education`, {
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
				setPendingUpdate(null)
			} else {
				throw new Error('Failed to update resume')
			}
		} catch (error) {
			console.error('Error updating resume:', error)
		}
	}

	const debouncedHandleUpdate = useCallback(debounce(handleUpdate, 1000), [resumeId])

	useEffect(() => {
		if (pendingUpdate) {
			debouncedHandleUpdate(pendingUpdate)
		}
	}, [pendingUpdate, debouncedHandleUpdate])

	const addNewEducation = () => {
		const we: Education = {
			id: v4(),
			institution: '',
			degree: '',
			startDate: '',
			endDate: '',
		}
		const newEducations = [...educations, we]
		setEducations(newEducations)
		setPendingUpdate({ educations: newEducations })
	}

	const deleteEducation = (id: string) => {
		const newEducations = educations.filter((item) => item.id !== id)
		setEducations(newEducations)
		setPendingUpdate({ educations: newEducations })
	}

	const updateEducation = (id: string, data: Partial<Education>) => {
		const newEducations = educations.map((item) => (item.id === id ? { ...item, ...data } : item))
		setEducations([...newEducations])
		setResumeData((prev) => (prev ? { ...prev, educations: newEducations } : prev))
		setPendingUpdate({ educations: newEducations })
	}

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

	return (
		<div className="mb-8 grid grid-cols-1 lg:grid-cols-2">
			<div className="col-span-1">
				<StepNavBar stepName="education" resumeId={resumeId || ''} />

				{/* FORM BODY */}
				<div className="p-4">
					<div className="grid grid-cols-4 gap-x-4 gap-y-1">
						<div className="col-span-2 flex flex-col justify-center gap-4">
							<div
								onClick={addNewEducation}
								className="flex items-center justify-center gap-2 rounded bg-gray-800 px-2 py-1 text-white hover:cursor-pointer hover:bg-gray-600"
							>
								<FaUserGraduate />
								<div>Thêm Học vấn</div>
							</div>
						</div>
						<div className="col-span-4 mt-4 flex flex-col gap-y-4">
							{educations.map((item, index) => (
								<div key={item.id} className="relative grid grid-cols-3 gap-x-4 rounded border px-8 py-6">
									<div className="col-span-1">
										<div>Tên trường/Cơ sở</div>
										<input
											value={item.institution}
											onChange={(e) => {
												updateEducation(item.id || '', { institution: e.target.value })
											}}
											className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
										/>
									</div>
									<div className="col-span-1">
										<div>Bằng cấp</div>
										<input
											value={item.degree}
											onChange={(e) => {
												updateEducation(item.id || '', { degree: e.target.value })
											}}
											className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
										/>
									</div>
									<div className="col-span-1" />
									<div className="col-span-1">
										<div>Ngày bắt đầu</div>
										<input
											type="date"
											value={item.startDate}
											onChange={(e) => {
												updateEducation(item.id || '', { startDate: e.target.value })
											}}
											className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
										/>
									</div>
									<div className="col-span-1">
										<div>Ngày kết thúc</div>
										<input
											type="date"
											value={item.endDate}
											onChange={(e) => {
												updateEducation(item.id || '', { endDate: e.target.value })
											}}
											className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
										/>
									</div>
									<div
										onClick={() => {
											deleteEducation(item.id || '')
										}}
										className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded bg-gray-800 text-white hover:cursor-pointer hover:bg-gray-600"
									>
										x
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Hints Section */}
				<div className="p-4">
					<h2 className="mb-4 text-lg font-semibold text-gray-800">Gợi ý cải thiện học vấn</h2>
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
										<span className="font-medium text-gray-800">Học vấn</span>
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
						<div className="text-center text-gray-500">Chưa có gợi ý nào cho học vấn</div>
					)}
				</div>

				<OneStepNavBar
					linkPrev={`/editor/generalInfo?resumeId=${resumeId}`}
					linkNext={`/editor/experience?resumeId=${resumeId}`}
				/>
			</div>
			<div className="col-span-1 mx-10 flex h-full flex-col">
				<ResumePreview resumeData={resumeData} />
			</div>
		</div>
	)
}
