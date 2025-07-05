'use client'
import { IoDocumentTextOutline, IoEllipsisVertical } from 'react-icons/io5'
import { useEffect, useState, useRef } from 'react'
import FormModal from '@/components/FormModal'
import { Resume } from '@/lib/types'
import ResumePreview from '@/components/ResumePreview'
import { useRouter } from 'next/navigation'
import { useReactToPrint } from 'react-to-print'

export default function ResumeListPage() {
	const [openModal, setOpenModal] = useState(false)
	const [openJdModal, setOpenJdModal] = useState(false)
	const [resumes, setResumes] = useState<Resume[]>([])
	const [openMenuId, setOpenMenuId] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [visibleResumes, setVisibleResumes] = useState<Set<string>>(new Set())
	const menuRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const resumeRefs = useRef<Map<string, HTMLDivElement>>(new Map())
	const router = useRouter()

	useEffect(() => {
		const fetchResume = async () => {
			try {
				setIsLoading(true)
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
				setIsLoading(false)
			}
		}
		fetchResume()
	}, [])

	// Đóng menu khi click ra ngoài
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setOpenMenuId(null)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Lazy loading với Intersection Observer
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const resumeId = entry.target.getAttribute('data-resume-id')
						if (resumeId) {
							setVisibleResumes((prev) => new Set(prev).add(resumeId))
						}
					}
				})
			},
			{ rootMargin: '100px' },
		)

		resumeRefs.current.forEach((ref) => {
			if (ref) observer.observe(ref)
		})

		return () => {
			resumeRefs.current.forEach((ref) => {
				if (ref) observer.unobserve(ref)
			})
		}
	}, [resumes])

	const handleEdit = (resumeId: string) => {
		router.push(`/editor/generalInfo?resumeId=${resumeId}`)
		setOpenMenuId(null)
	}

	const handleDelete = async (resumeId: string) => {
		try {
			const response = await fetch(`/api/resume/${resumeId}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			})
			if (response.ok) {
				setResumes(resumes.filter((resume) => resume.id !== resumeId))
				setVisibleResumes((prev) => {
					const newSet = new Set(prev)
					newSet.delete(resumeId)
					return newSet
				})
				setOpenMenuId(null)
			} else {
				console.error('Không thể xóa hồ sơ')
			}
		} catch (error) {
			console.error('Lỗi khi xóa hồ sơ:', error)
		}
	}

	const handlePrint = useReactToPrint({
		contentRef,
		documentTitle: 'Hồ sơ',
	})

	const toggleMenu = (resumeId: string) => {
		setOpenMenuId(openMenuId === resumeId ? null : resumeId)
	}

	const SkeletonResume = () => (
		<div className="relative animate-pulse rounded-lg border border-gray-300 bg-white p-4 shadow-md">
			<div className="aspect-[3/4] rounded-md bg-gray-200"></div>
			<div className="mt-3 h-6 w-3/4 rounded bg-gray-200"></div>
		</div>
	)

	return (
		<div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
			<h1 className="mb-6 text-2xl font-bold text-gray-900">Danh sách CV</h1>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{isLoading
					? // Hiển thị 4 skeleton placeholders khi đang tải
						[...Array(4)].map((_, index) => <SkeletonResume key={index} />)
					: resumes.map((item) => (
							<div
								key={item.id}
								data-resume-id={item.id}
								ref={(el) => {
									if (el) resumeRefs.current.set(item.id, el)
								}}
								className="relative rounded-lg border border-gray-300 bg-white shadow-md transition-shadow hover:shadow-lg"
							>
								<div className="p-4">
									<div className="aspect-[3/4] overflow-hidden rounded-md">
										{visibleResumes.has(item.id) ? (
											<ResumePreview resumeData={item} contentRef={openMenuId === item.id ? contentRef : null} />
										) : (
											<div className="aspect-[3/4] animate-pulse rounded-md bg-gray-200"></div>
										)}
									</div>
									<h3 className="mt-3 truncate text-lg font-semibold text-gray-800">
										{item.title || 'CV chưa có tiêu đề'}
									</h3>
								</div>
								<div className="absolute top-2 right-2">
									<button
										onClick={() => toggleMenu(item.id)}
										className="rounded-full bg-gray-200 p-2 hover:bg-gray-400 focus:outline-none"
										aria-label="Tùy chọn khác"
									>
										<IoEllipsisVertical className="text-gray-600" />
									</button>
									{openMenuId === item.id && (
										<div
											ref={menuRef}
											className="absolute right-0 z-10 mt-2 w-36 rounded-md border border-gray-200 bg-white shadow-lg"
										>
											<button
												onClick={() => handleEdit(item.id)}
												className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
											>
												Chỉnh sửa
											</button>
											<button
												onClick={() => handleDelete(item.id)}
												className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
											>
												Xóa
											</button>
											<button
												onClick={handlePrint}
												className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
											>
												In
											</button>
										</div>
									)}
								</div>
							</div>
						))}
			</div>
			<div className="mt-8 flex items-center gap-4">
				<button
					onClick={() => setOpenModal(true)}
					className="flex items-center gap-2 rounded-xl bg-gray-600 px-4 py-2 text-lg font-semibold text-white transition-colors hover:bg-gray-700"
				>
					<IoDocumentTextOutline />
					Tạo mới
				</button>
				<FormModal isOpen={openModal} onClose={() => setOpenModal(false)} formName="newcv" fullScreen={true} />
				<button
					onClick={() => setOpenJdModal(true)}
					className="flex items-center gap-2 rounded-xl bg-gray-600 px-4 py-2 text-lg font-semibold text-white transition-colors hover:bg-gray-700"
				>
					<IoDocumentTextOutline />
					Tự động với JD
				</button>
				<FormModal
					isOpen={openJdModal}
					onClose={() => setOpenJdModal(false)}
					formName="newcvwithjd"
					fullScreen={true}
				/>
			</div>
		</div>
	)
}
