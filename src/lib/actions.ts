'use server'
import { ResumeService } from './ResumeService'

type CurrentState = {
	success: boolean
	error: boolean
}
export const createResume = async (currentState: CurrentState, formData: FormData) => {
	const data: any = Object.fromEntries(formData)

	const resumeSerivce = new ResumeService()
	resumeSerivce.createResume({
		title: data.title,
		description: data.description,
		workExperiences: [],
		educations: [],
		skills: [],
	})

	return { success: true, error: false }
}
