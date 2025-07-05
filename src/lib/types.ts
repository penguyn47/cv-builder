export interface Resume {
	id: string
	title?: string
	description?: string
	photoId?: string
	summary?: string
	firstName?: string
	lastName?: string
	jobTitle?: string
	city?: string
	country?: string
	phone?: string
	email?: string
	workExperiences: WorkExperience[]
	educations: Education[]
	skills: string[]
	createdAt: string
	updatedAt: string
	fontFamily?: string
	bgColor?: string
	primaryColor?: string
	secondaryColor?: string
	textColor?: string
	selectedLayoutIndex?: number
	selectedStyleIndex?: number
	photoData?: string
}

export interface WorkExperience {
	id?: string
	company: string
	position: string
	startDate: string
	endDate?: string
	description: string
}

export interface Education {
	id: string
	institution: string
	degree: string
	startDate: string
	endDate?: string
}

export interface UserProfile {
	id: string
	firstName: string
	lastName: string
	phone: string
	email: string
	city: string
	country: string
	job: string
	education: Education[]
	experience: WorkExperience[]
	additionalInfo: string
	createdAt: string
	updatedAt: string
}

export interface Hint {
	id: string
	resumeId: string
	type: 'success' | 'notice'
	content: string
	part: 'generalInfo' | 'experience' | 'education' | 'skills' | 'summary'
	createdAt: string
	updatedAt: string
}
