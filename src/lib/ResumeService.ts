import { readFile, writeFile } from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { Resume } from './types'

const RESUMES_FILE = path.join(process.cwd(), 'data', 'resumes.json')

export class ResumeService {
	private async readResumes(): Promise<Resume[]> {
		try {
			const data = await readFile(RESUMES_FILE, 'utf-8')
			return JSON.parse(data) as Resume[]
		} catch (error) {
			return []
		}
	}

	private async writeResumes(resumes: Resume[]): Promise<void> {
		await writeFile(RESUMES_FILE, JSON.stringify(resumes, null, 2))
	}

	async getAllResumes(): Promise<Resume[]> {
		return await this.readResumes()
	}

	async getResumeById(id: string): Promise<Resume | null> {
		const resumes = await this.readResumes()
		return resumes.find((resume) => resume.id === id) || null
	}

	async createResume(resumeData: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resume> {
		const resumes = await this.readResumes()
		const newResume: Resume = {
			id: uuidv4(),
			...resumeData,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			workExperiences: resumeData.workExperiences.map((we) => ({
				...we,
				id: uuidv4(),
			})),
			educations: resumeData.educations.map((edu) => ({
				...edu,
				id: uuidv4(),
			})),
		}

		resumes.push(newResume)
		await this.writeResumes(resumes)
		return newResume
	}

	async updateResume(id: string, updateData: Partial<Resume>): Promise<Resume | null> {
		const resumes = await this.readResumes()
		const resumeIndex = resumes.findIndex((resume) => resume.id === id)

		if (resumeIndex === -1) {
			return null
		}

		const updatedResume: Resume = {
			...resumes[resumeIndex],
			...updateData,
			updatedAt: new Date().toISOString(),
			workExperiences:
				updateData.workExperiences?.map((we) => ({
					...we,
					id: we.id || uuidv4(),
				})) || resumes[resumeIndex].workExperiences,
			educations:
				updateData.educations?.map((edu) => ({
					...edu,
					id: edu.id || uuidv4(),
				})) || resumes[resumeIndex].educations,
		}

		resumes[resumeIndex] = updatedResume
		await this.writeResumes(resumes)
		return updatedResume
	}

	async deleteResume(id: string): Promise<boolean> {
		const resumes = await this.readResumes()
		const resumeIndex = resumes.findIndex((resume) => resume.id === id)

		if (resumeIndex === -1) {
			return false
		}

		resumes.splice(resumeIndex, 1)
		await this.writeResumes(resumes)
		return true
	}
}
