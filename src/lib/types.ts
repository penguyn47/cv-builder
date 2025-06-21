export interface Resume {
	id: string
	title?: string
	description?: string
	photoUrl?: string
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
	backgroundColor?: string
	fontFamily?: string
}

export interface WorkExperience {
	id: string
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
	fieldOfStudy: string
	startDate: string
	endDate?: string
}
