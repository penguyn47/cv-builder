'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Education, UserProfile, WorkExperience } from '@/lib/types'
import { MdOutlineEdit } from 'react-icons/md'
import { BsX } from 'react-icons/bs'
import { BsCheck } from 'react-icons/bs'
import { RiDeleteBin2Fill } from 'react-icons/ri'

export default function ProfilePage() {
	const [isEditing, setIsEditing] = useState(false)
	const [profile, setProfile] = useState<UserProfile | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetch('/api/profile')
				if (!response.ok) throw new Error('Failed to fetch profile')
				const data = await response.json()
				if (Object.keys(data).length === 0) {
					// Create default profile
					const defaultProfile = {
						firstName: '',
						lastName: '',
						phone: '',
						email: '',
						city: '',
						country: '',
						job: '',
						education: [],
						experience: [],
						additionalInfo: '',
					}
					const createResponse = await fetch('/api/profile', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(defaultProfile),
					})
					if (!createResponse.ok) throw new Error('Failed to create profile')
					setProfile(await createResponse.json())
				} else {
					setProfile(data)
				}
			} catch (err) {
				setError('Error loading profile')
			} finally {
				setLoading(false)
			}
		}
		fetchProfile()
	}, [])

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		field: keyof UserProfile,
	) => {
		if (profile) {
			setProfile({ ...profile, [field]: e.target.value })
		}
	}

	const handleEducationChange = (index: number, field: keyof Education, value: string) => {
		if (profile) {
			const newEducation = [...profile.education]
			newEducation[index] = { ...newEducation[index], [field]: value }
			setProfile({ ...profile, education: newEducation })
		}
	}

	const handleExperienceChange = (index: number, field: keyof WorkExperience, value: string) => {
		if (profile) {
			const newExperience = [...profile.experience]
			newExperience[index] = { ...newExperience[index], [field]: value }
			setProfile({ ...profile, experience: newExperience })
		}
	}

	const addEducation = async () => {
		if (profile) {
			const newEducation = {
				institution: '',
				degree: '',
				startDate: '',
				endDate: '',
			}
			try {
				const response = await fetch('/api/profile/education', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: profile.id, education: newEducation }),
				})
				if (!response.ok) throw new Error('Failed to add education')
				setProfile(await response.json())
			} catch (err) {
				setError('Failed to add education')
			}
		}
	}

	const addExperience = async () => {
		if (profile) {
			const newExperience = {
				company: '',
				position: '',
				startDate: '',
				endDate: '',
				description: '',
			}
			try {
				const response = await fetch('/api/profile/experience', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: profile.id, experience: newExperience }),
				})
				if (!response.ok) throw new Error('Failed to add experience')
				setProfile(await response.json())
			} catch (err) {
				setError('Failed to add experience')
			}
		}
	}

	const removeEducation = async (index: number) => {
		if (profile && profile.education[index].id) {
			try {
				const response = await fetch('/api/profile/education', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: profile.id, educationId: profile.education[index].id }),
				})
				if (!response.ok) throw new Error('Failed to delete education')
				setProfile(await response.json())
			} catch (err) {
				setError('Failed to delete education')
			}
		}
	}

	const removeExperience = async (index: number) => {
		if (profile && profile.experience[index].id) {
			try {
				const response = await fetch('/api/profile/experience', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: profile.id, experienceId: profile.experience[index].id }),
				})
				if (!response.ok) throw new Error('Failed to delete experience')
				setProfile(await response.json())
			} catch (err) {
				setError('Failed to delete experience')
			}
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (profile) {
			try {
				const response = await fetch('/api/profile', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(profile),
				})
				if (!response.ok) throw new Error('Failed to update profile')
				setProfile(await response.json())
				setIsEditing(false)
				setError(null)
			} catch (err) {
				setError('Failed to update profile')
			}
		}
	}

	if (loading) {
		return <div className="mx-auto max-w-4xl p-6">Đang tải...</div>
	}

	if (error) {
		return <div className="mx-auto max-w-4xl p-6 text-red-600">{error}</div>
	}

	if (!profile) {
		return <div className="mx-auto max-w-4xl p-6">Lỗi khi tải hồ sơ</div>
	}

	return (
		<div className="mx-auto flex max-w-4xl flex-col justify-center p-6">
			{error && <div className="mb-4 text-red-600">{error}</div>}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Action Buttons */}
				<div className="flex justify-end space-x-4">
					{isEditing ? (
						<>
							<button
								type="button"
								onClick={() => setIsEditing(false)}
								className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
							>
								<BsX />
							</button>
							<button type="submit" className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
								<BsCheck />
							</button>
						</>
					) : (
						<button
							type="button"
							onClick={() => setIsEditing(true)}
							className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
						>
							<MdOutlineEdit />
						</button>
					)}
				</div>
				{/* Personal Information */}
				<div className="rounded-lg border bg-white p-6">
					<h2 className="mb-4 text-xl font-semibold">Thông tin cá nhân</h2>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="block text-sm font-medium text-gray-700">Tên</label>
							{isEditing ? (
								<input
									type="text"
									value={profile.firstName}
									onChange={(e) => handleInputChange(e, 'firstName')}
									className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							) : (
								<p className="mt-1">{profile.firstName || 'Chưa cung cấp'}</p>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Họ</label>
							{isEditing ? (
								<input
									type="text"
									value={profile.lastName}
									onChange={(e) => handleInputChange(e, 'lastName')}
									className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							) : (
								<p className="mt-1">{profile.lastName || 'Chưa cung cấp'}</p>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
							{isEditing ? (
								<input
									type="tel"
									value={profile.phone}
									onChange={(e) => handleInputChange(e, 'phone')}
									className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							) : (
								<p className="mt-1">{profile.phone || 'Chưa cung cấp'}</p>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Email</label>
							{isEditing ? (
								<input
									type="email"
									value={profile.email}
									onChange={(e) => handleInputChange(e, 'email')}
									className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							) : (
								<p className="mt-1">{profile.email || 'Chưa cung cấp'}</p>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Thành phố</label>
							{isEditing ? (
								<input
									type="text"
									value={profile.city}
									onChange={(e) => handleInputChange(e, 'city')}
									className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							) : (
								<p className="mt-1">{profile.city || 'Chưa cung cấp'}</p>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Quốc gia</label>
							{isEditing ? (
								<input
									type="text"
									value={profile.country}
									onChange={(e) => handleInputChange(e, 'country')}
									className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							) : (
								<p className="mt-1">{profile.country || 'Chưa cung cấp'}</p>
							)}
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700">Công việc hiện tại</label>
							{isEditing ? (
								<input
									type="text"
									value={profile.job}
									onChange={(e) => handleInputChange(e, 'job')}
									className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							) : (
								<p className="mt-1">{profile.job || 'Chưa cung cấp'}</p>
							)}
						</div>
					</div>
				</div>

				{/* Education */}
				<div className="rounded-lg border bg-white p-6">
					<h2 className="mb-4 text-xl font-semibold">Học vấn</h2>
					{profile.education.map((edu, index) => (
						<div key={edu.id || index} className="mb-4 border-b pb-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label className="block text-sm font-medium text-gray-700">Cơ sở giáo dục</label>
									{isEditing ? (
										<input
											type="text"
											value={edu.institution}
											onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
											className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										/>
									) : (
										<p className="mt-1">{edu.institution || 'Chưa cung cấp'}</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Bằng cấp</label>
									{isEditing ? (
										<input
											type="text"
											value={edu.degree}
											onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
											className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										/>
									) : (
										<p className="mt-1">{edu.degree || 'Chưa cung cấp'}</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
									{isEditing ? (
										<input
											type="date"
											value={edu.startDate}
											onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
											className="shadow(Not provided) -sm mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 focus:border-indigo-500 focus:ring-indigo-500"
										/>
									) : (
										<p className="mt-1">
											{edu.startDate ? format(new Date(edu.startDate), 'MMM yyyy') : 'Chưa cung cấp'}
										</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
									{isEditing ? (
										<input
											type="date"
											value={edu.endDate || ''}
											onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
											className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										/>
									) : (
										<p className="mt-1">{edu.endDate ? format(new Date(edu.endDate), 'MMM yyyy') : 'Hiện tại'}</p>
									)}
								</div>
							</div>
							{isEditing && (
								<button
									type="button"
									onClick={() => removeEducation(index)}
									className="te xt-2xl mt-2 flex items-center gap-2 text-red-600 hover:cursor-pointer hover:text-red-800"
								>
									<RiDeleteBin2Fill />
									<span className="text-sm">Xóa</span>
								</button>
							)}
						</div>
					))}
					{isEditing && (
						<button type="button" onClick={addEducation} className="text-indigo-600 hover:text-indigo-800">
							Thêm học vấn
						</button>
					)}
				</div>

				{/* Experience */}
				<div className="rounded-lg border bg-white p-6">
					<h2 className="mb-4 text-xl font-semibold">Kinh nghiệm làm việc</h2>
					{profile.experience.map((exp, index) => (
						<div key={exp.id || index} className="mb-4 border-b pb-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label className="block text-sm font-medium text-gray-700">Công ty/Dự án</label>
									{isEditing ? (
										<input
											type="text"
											value={exp.company}
											onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
											className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										/>
									) : (
										<p className="mt-1">{exp.company || 'Chưa cung cấp'}</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Vị trí</label>
									{isEditing ? (
										<input
											type="text"
											value={exp.position}
											onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
											className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										/>
									) : (
										<p className="mt-1">{exp.position || 'Chưa cung cấp'}</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
									{isEditing ? (
										<input
											type="date"
											value={exp.startDate}
											onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
											className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										/>
									) : (
										<p className="mt-1">
											{exp.startDate ? format(new Date(exp.startDate), 'MMM yyyy') : 'Chưa cung cấp'}
										</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
									{isEditing ? (
										<input
											type="date"
											value={exp.endDate || ''}
											onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
											className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										/>
									) : (
										<p className="mt-1">{exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Hiện tại'}</p>
									)}
								</div>
								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-gray-700">Mô tả</label>
									{isEditing ? (
										<textarea
											value={exp.description}
											onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
											className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
											rows={4}
										/>
									) : (
										<p className="mt-1">{exp.description || 'Chưa cung cấp'}</p>
									)}
								</div>
							</div>
							{isEditing && (
								<button
									type="button"
									onClick={() => removeExperience(index)}
									className="te xt-2xl mt-2 flex items-center gap-2 text-red-600 hover:cursor-pointer hover:text-red-800"
								>
									<RiDeleteBin2Fill />
									<span className="text-sm">Xóa</span>
								</button>
							)}
						</div>
					))}
					{isEditing && (
						<button type="button" onClick={addExperience} className="text-indigo-600 hover:text-indigo-800">
							Thêm kinh nghiệm
						</button>
					)}
				</div>

				{/* Additional Information */}
				<div className="rounded-lg border bg-white p-6">
					<h2 className="mb-4 text-xl font-semibold">Thông tin bổ sung</h2>
					{isEditing ? (
						<textarea
							value={profile.additionalInfo}
							onChange={(e) => handleInputChange(e, 'additionalInfo')}
							className="mt-1 block w-full rounded-md border border-gray-400 px-1 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							rows={6}
						/>
					) : (
						<p className="mt-1">{profile.additionalInfo || 'Chưa cung cấp'}</p>
					)}
				</div>
			</form>
		</div>
	)
}
