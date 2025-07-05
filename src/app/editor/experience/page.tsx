'use client'

import OneStepNavBar from '@/components/OneStepNavBar'
import ResumePreview from '@/components/ResumePreview'
import StepNavBar from '@/components/StepNavBar'
import { Resume, WorkExperience, Hint } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import { FaRobot } from 'react-icons/fa'
import { MdWork } from 'react-icons/md'
import { v4 } from 'uuid'

export default function Page() {
	const params = useSearchParams()
	const resumeId = params.get('resumeId')
	const [resumeData, setResumeData] = useState<Resume | null>(null)
	const [experiences, setExperiences] = useState<WorkExperience[]>([])
	const [pendingUpdate, setPendingUpdate] = useState<Partial<Resume> | null>(null)
	const [showAIDescription, setShowAIDescription] = useState<string | null>(null)
	const [aiDescription, setAiDescription] = useState<string>('')
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
					setExperiences(data.workExperiences || [])
				} else {
					console.error('Failed to fetch resume data')
				}
			} catch (error) {
				console.error('Error getting resume data:', error)
			}
		}
		fetchResume()
	}, [resumeId])

	// Fetch hints for experience
	useEffect(() => {
		const fetchHints = async () => {
			if (!resumeId) return
			try {
				setHintsLoading(true)
				const response = await fetch(`/api/hints?resumeId=${resumeId}&part=experience`, {
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

	const addANewExperience = () => {
		const we: WorkExperience = {
			id: v4(),
			company: '',
			position: '',
			startDate: '',
			endDate: '',
			description: '',
		}
		const newExperiences = [...experiences, we]
		setExperiences(newExperiences)
		setPendingUpdate({ workExperiences: newExperiences })
	}

	const deleteExperience = (id: string) => {
		const newExperiences = experiences.filter((item) => item.id !== id)
		setExperiences(newExperiences)
		setPendingUpdate({ workExperiences: newExperiences })
		if (showAIDescription === id) {
			setShowAIDescription(null)
		}
	}

	const updateExperience = (id: string, data: Partial<WorkExperience>) => {
		const newExperiences = experiences.map((item) => (item.id === id ? { ...item, ...data } : item))
		setExperiences([...newExperiences])
		setResumeData((prev) => (prev ? { ...prev, workExperiences: newExperiences } : prev))
		setPendingUpdate({ workExperiences: newExperiences })
	}

	const handleUseAI = (id: string) => {
		setShowAIDescription(id)
		setAiDescription('')
	}

	const handleAIConfirm = async (id: string) => {
		if (!aiDescription) {
			alert('Vui lòng nhập mô tả công việc để sử dụng AI.')
			return
		}

		try {
			const response = await fetch('/api/openai/experience', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ description: aiDescription }),
			})

			if (response.ok) {
				const aiData: WorkExperience = await response.json()
				updateExperience(id, {
					company: aiData.company,
					position: aiData.position,
					startDate: aiData.startDate,
					endDate: aiData.endDate,
					description: aiData.description,
				})
				setShowAIDescription(null)
				setAiDescription('')
			} else {
				throw new Error('Failed to process AI description')
			}
		} catch (error) {
			console.error('Error processing AI description:', error)
			alert('Đã xảy ra lỗi khi gọi API OpenAI.')
		}
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
				<StepNavBar stepName="experience" resumeId={resumeId || ''} />

				{/* FORM BODY */}
				<div className="p-4">
					<div className="grid grid-cols-4 gap-x-4 gap-y-1">
						<div className="col-span-2 flex flex-col justify-center gap-4">
							<div
								onClick={addANewExperience}
								className="flex items-center justify-center gap-2 rounded bg-gray-800 px-2 py-1 text-white hover:cursor-pointer hover:bg-gray-600"
							>
								<MdWork />
								<div>Thêm kinh nghiệm</div>
							</div>
						</div>
						<div className="col-span-4 mt-4 flex flex-col gap-y-4">
							{experiences.map((item, index) => (
								<div key={item.id} className="relative grid grid-cols-3 gap-x-4 rounded border px-8 py-6">
									<div className="col-span-1">
										<div>Tên công ty / Dự án</div>
										<input
											value={item.company}
											onChange={(e) => {
												updateExperience(item.id || '', { company: e.target.value })
											}}
											className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
										/>
									</div>
									<div className="col-span-1">
										<div>Vị trí</div>
										<input
											value={item.position}
											onChange={(e) => {
												updateExperience(item.id || '', { position: e.target.value })
											}}
											className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
										/>
									</div>
									<div className="col-span-1"></div>
									<div className="col-span-1">
										<div>Ngày bắt đầu</div>
										<input
											type="date"
											value={item.startDate}
											onChange={(e) => {
												updateExperience(item.id || '', { startDate: e.target.value })
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
												updateExperience(item.id || '', { endDate: e.target.value })
											}}
											className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
										/>
									</div>
									<div className="col-span-1"></div>
									<div className="col-span-3">
										<div>Mô tả</div>
										<textarea
											value={item.description}
											onChange={(e) => {
												updateExperience(item.id || '', { description: e.target.value })
											}}
											className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
										/>
									</div>
									<div className="col-span-1">
										<div
											onClick={() => handleUseAI(item.id || '')}
											className="flex items-center justify-center gap-4 rounded bg-gray-800 py-1 text-white hover:cursor-pointer hover:bg-gray-600"
										>
											<FaRobot />
											<div>Dùng AI</div>
										</div>
									</div>
									{showAIDescription === item.id && (
										<div className="col-span-3 mt-4">
											<div>Nhập mô tả để AI xử lý</div>
											<textarea
												value={aiDescription}
												onChange={(e) => setAiDescription(e.target.value)}
												className="w-full rounded-md border border-gray-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
												placeholder="Nhập mô tả công việc để AI phân tích..."
											/>
											<div className="mt-2 flex gap-2">
												<button
													onClick={() => handleAIConfirm(item.id || '')}
													className="flex items-center justify-center rounded bg-gray-800 px-2 py-1 text-white hover:cursor-pointer hover:bg-gray-600"
												>
													Xác nhận
												</button>
												<button
													onClick={() => setShowAIDescription(null)}
													className="flex items-center justify-center rounded bg-gray-300 px-2 py-1 hover:cursor-pointer hover:bg-gray-200"
												>
													Hủy
												</button>
											</div>
										</div>
									)}
									<div
										onClick={() => {
											deleteExperience(item.id || '')
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
					<h2 className="mb-4 text-lg font-semibold text-gray-800">Gợi ý cải thiện kinh nghiệm</h2>
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
										<span className="font-medium text-gray-800">Kinh nghiệm</span>
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
						<div className="text-center text-gray-500">Chưa có gợi ý nào cho kinh nghiệm</div>
					)}
				</div>

				<OneStepNavBar
					linkPrev={`/editor/education?resumeId=${resumeId}`}
					linkNext={`/editor/skill?resumeId=${resumeId}`}
				/>
			</div>
			<div className="col-span-1 mx-10 flex h-full flex-col">
				<ResumePreview resumeData={resumeData} />
			</div>
		</div>
	)
}
