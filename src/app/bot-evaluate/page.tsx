'use client'

import { Resume, Hint } from '@/lib/types'
import { useEffect, useState } from 'react'
import ResumePreview from '@/components/ResumePreview'
import Link from 'next/link'

export default function Page() {
	const [resumes, setResumes] = useState<Resume[]>([])
	const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
	const [loading, setLoading] = useState(true)
	const [jobDescription, setJobDescription] = useState<string>('')
	const [evaluationLoading, setEvaluationLoading] = useState(false)
	const [evaluationResult, setEvaluationResult] = useState<string | null>(null)
	const [hints, setHints] = useState<Hint[]>([])
	const [hintsLoading, setHintsLoading] = useState(false)

	useEffect(() => {
		const fetchResume = async () => {
			try {
				setLoading(true)
				const response = await fetch(`/api/resume/`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				})
				if (response.ok) {
					const data: Resume[] = await response.json()
					setResumes(data)
				} else {
					console.error('Không thể tải dữ liệu hồ sơ')
				}
			} catch (error) {
				console.error('Lỗi khi lấy dữ liệu hồ sơ:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchResume()
	}, [])

	useEffect(() => {
		const fetchHints = async () => {
			if (!selectedResume) return
			try {
				setHintsLoading(true)
				const response = await fetch(`/api/hints?resumeId=${selectedResume.id}`, {
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
	}, [selectedResume])

	const handleSelectResume = (resume: Resume) => {
		setSelectedResume(resume)
		setHints([]) // Reset hints khi chọn resume mới
	}

	const handleEvaluateResume = async () => {
		if (!selectedResume || !jobDescription) {
			setEvaluationResult('Vui lòng chọn một hồ sơ và nhập mô tả công việc.')
			return
		}

		setEvaluationLoading(true)
		setEvaluationResult(null)

		try {
			const response = await fetch('/api/openai/evaluate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					resumeData: { ...selectedResume, photoData: '' },
					jobDescription,
				}),
			})

			if (response.ok) {
				setEvaluationResult('Đánh giá hoàn tất! Các gợi ý đã được lưu.')
				const hintsResponse = await fetch(`/api/hints?resumeId=${selectedResume.id}`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				})
				if (hintsResponse.ok) {
					const data: Hint[] = await hintsResponse.json()
					setHints(data)
				}
			} else {
				setEvaluationResult('Lỗi khi đánh giá hồ sơ.')
			}
		} catch (error) {
			setEvaluationResult('Lỗi khi gọi API đánh giá.')
			console.error('Lỗi:', error)
		} finally {
			setEvaluationLoading(false)
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
		<div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
			<div className="flex w-full max-w-7xl flex-col gap-6">
				{/* Resume Selection and Preview Section */}
				<div className="flex flex-col gap-6 md:flex-row">
					{/* Resume Selection List */}
					<div className="w-full rounded-lg bg-white p-6 shadow-lg md:w-1/3">
						<h2 className="mb-4 text-xl font-semibold text-gray-800">Chọn Hồ sơ</h2>
						<div className="max-h-96 space-y-3 overflow-y-auto">
							{loading ? (
								Array(3)
									.fill(0)
									.map((_, index) => (
										<div
											key={index}
											className="flex animate-pulse items-center justify-between rounded-lg bg-gray-200 p-3"
										>
											<div className="h-6 w-3/4 rounded bg-gray-300"></div>
											<div className="h-8 w-16 rounded bg-gray-300"></div>
										</div>
									))
							) : resumes.length > 0 ? (
								resumes.map((resume) => (
									<div
										key={resume.id}
										className={`flex items-center justify-between rounded-lg p-3 transition-colors ${
											selectedResume?.id === resume.id
												? 'border border-gray-400 bg-gray-300'
												: 'bg-gray-50 hover:bg-gray-100'
										}`}
									>
										<span className="truncate font-medium text-gray-800">{resume.title}</span>
										<button
											onClick={() => handleSelectResume(resume)}
											className="ml-4 rounded-md bg-gray-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
										>
											Chọn
										</button>
									</div>
								))
							) : (
								<div className="text-center text-gray-500">Không có hồ sơ nào</div>
							)}
						</div>
					</div>

					{/* Resume Preview Section */}
					<div className="w-full rounded-lg bg-white p-4 shadow-lg md:w-1/2">
						<h2 className="mb-4 text-lg font-semibold text-gray-800">Xem trước Hồ sơ</h2>
						{selectedResume ? (
							<div className="max-h-96 overflow-y-auto">
								<ResumePreview resumeData={selectedResume} />
							</div>
						) : (
							<div className="text-center text-gray-500">Chọn một hồ sơ để xem trước</div>
						)}
					</div>
				</div>

				{/* Job Description Section */}
				<div className="w-full rounded-lg bg-white p-6 shadow-lg">
					<h2 className="mb-4 text-xl font-semibold text-gray-800">Mô tả công việc</h2>
					<textarea
						name="jobDescription"
						id="jobDescription"
						placeholder="Nhập Mô tả công việc"
						className="h-64 w-full resize-none rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
						value={jobDescription}
						onChange={(e) => setJobDescription(e.target.value)}
					></textarea>
					<div className="mt-4 flex items-center justify-between">
						<button
							onClick={handleEvaluateResume}
							disabled={evaluationLoading}
							className={`rounded-md px-4 py-2 text-white transition-colors ${
								evaluationLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
							}`}
						>
							{evaluationLoading ? 'Đang đánh giá...' : 'Dùng AI để đánh giá'}
						</button>
						{evaluationResult && <span className="text-sm text-gray-600">{evaluationResult}</span>}
					</div>
				</div>

				{/* Hints Section */}
				<div className="w-full rounded-lg bg-white p-6 shadow-lg">
					<h2 className="mb-4 text-xl font-semibold text-gray-800">Gợi ý cải thiện hồ sơ</h2>
					{hintsLoading ? (
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
						<div className="max-h-96 space-y-3 overflow-y-auto">
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
										<span className="font-medium text-gray-800">
											{hint.part === 'generalInfo' && 'Thông tin chung'}
											{hint.part === 'experience' && 'Kinh nghiệm làm việc'}
											{hint.part === 'education' && 'Học vấn'}
											{hint.part === 'skills' && 'Kỹ năng'}
											{hint.part === 'summary' && 'Tóm tắt'}
										</span>
										<div className="flex items-center space-x-2">
											<span
												className={`text-sm font-semibold ${
													hint.type === 'success' ? 'text-green-600' : 'text-yellow-600'
												}`}
											>
												{hint.type === 'success' ? 'Thành công' : 'Gợi ý chỉnh sửa'}
											</span>
											<Link
												href={`/editor/${hint.part}?resumeId=${selectedResume?.id}`}
												className="rounded-md bg-blue-600 px-2 py-1 text-sm font-medium text-white hover:bg-blue-700"
											>
												Cải thiện ngay
											</Link>
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
						<div className="text-center text-gray-500">Chưa có gợi ý nào cho hồ sơ này</div>
					)}
				</div>
			</div>
		</div>
	)
}
