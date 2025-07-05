import { readFile, writeFile } from 'fs/promises'
import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { Education, UserProfile, WorkExperience } from './types'

const PROFILE_FILE = path.join(process.cwd(), 'data', 'profile.json')

export class ProfileService {
	public async ProfileService() {
		try {
			await fs.access(PROFILE_FILE)
		} catch {
			await fs.mkdir(path.dirname(PROFILE_FILE), { recursive: true })
			await fs.writeFile(PROFILE_FILE, JSON.stringify(null))
		}
	}

	private async readProfile(): Promise<UserProfile | null> {
		try {
			const data = await readFile(PROFILE_FILE, 'utf-8')
			return JSON.parse(data) as UserProfile | null
		} catch (error) {
			return null
		}
	}

	private async writeProfile(profile: UserProfile | null): Promise<void> {
		await writeFile(PROFILE_FILE, JSON.stringify(profile, null, 2))
	}

	async getProfile(): Promise<UserProfile | null> {
		return await this.readProfile()
	}

	async createProfile(profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
		const newProfile: UserProfile = {
			id: uuidv4(),
			...profileData,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			education: profileData.education.map((edu) => ({
				...edu,
				id: uuidv4(),
			})),
			experience: profileData.experience.map((exp) => ({
				...exp,
				id: uuidv4(),
			})),
		}

		await this.writeProfile(newProfile)
		return newProfile
	}

	async updateProfile(id: string, updateData: Partial<UserProfile>): Promise<UserProfile | null> {
		const currentProfile = await this.readProfile()

		if (!currentProfile || currentProfile.id !== id) {
			return null
		}

		const updatedProfile: UserProfile = {
			...currentProfile,
			...updateData,
			updatedAt: new Date().toISOString(),
			education:
				updateData.education?.map((edu) => ({
					...edu,
					id: edu.id || uuidv4(),
				})) || currentProfile.education,
			experience:
				updateData.experience?.map((exp) => ({
					...exp,
					id: exp.id || uuidv4(),
				})) || currentProfile.experience,
		}

		await this.writeProfile(updatedProfile)
		return updatedProfile
	}

	async deleteProfile(id: string): Promise<boolean> {
		const currentProfile = await this.readProfile()

		if (!currentProfile || currentProfile.id !== id) {
			return false
		}

		await this.writeProfile(null)
		return true
	}

	async addEducation(id: string, education: Omit<Education, 'id'>): Promise<UserProfile | null> {
		const currentProfile = await this.readProfile()

		if (!currentProfile || currentProfile.id !== id) {
			return null
		}

		const updatedProfile: UserProfile = {
			...currentProfile,
			education: [
				...currentProfile.education,
				{
					...education,
					id: uuidv4(),
				},
			],
			updatedAt: new Date().toISOString(),
		}

		await this.writeProfile(updatedProfile)
		return updatedProfile
	}

	async updateEducation(
		id: string,
		educationId: string,
		educationData: Partial<Education>,
	): Promise<UserProfile | null> {
		const currentProfile = await this.readProfile()

		if (!currentProfile || currentProfile.id !== id) {
			return null
		}

		const updatedProfile: UserProfile = {
			...currentProfile,
			education: currentProfile.education.map((edu) => (edu.id === educationId ? { ...edu, ...educationData } : edu)),
			updatedAt: new Date().toISOString(),
		}

		await this.writeProfile(updatedProfile)
		return updatedProfile
	}

	async deleteEducation(id: string, educationId: string): Promise<UserProfile | null> {
		const currentProfile = await this.readProfile()

		if (!currentProfile || currentProfile.id !== id) {
			return null
		}

		const updatedProfile: UserProfile = {
			...currentProfile,
			education: currentProfile.education.filter((edu) => edu.id !== educationId),
			updatedAt: new Date().toISOString(),
		}

		await this.writeProfile(updatedProfile)
		return updatedProfile
	}

	async addExperience(id: string, experience: Omit<WorkExperience, 'id'>): Promise<UserProfile | null> {
		const currentProfile = await this.readProfile()

		if (!currentProfile || currentProfile.id !== id) {
			return null
		}

		const updatedProfile: UserProfile = {
			...currentProfile,
			experience: [
				...currentProfile.experience,
				{
					...experience,
					id: uuidv4(),
				},
			],
			updatedAt: new Date().toISOString(),
		}

		await this.writeProfile(updatedProfile)
		return updatedProfile
	}

	async updateExperience(
		id: string,
		experienceId: string,
		experienceData: Partial<WorkExperience>,
	): Promise<UserProfile | null> {
		const currentProfile = await this.readProfile()

		if (!currentProfile || currentProfile.id !== id) {
			return null
		}

		const updatedProfile: UserProfile = {
			...currentProfile,
			experience: currentProfile.experience.map((exp) =>
				exp.id === experienceId ? { ...exp, ...experienceData } : exp,
			),
			updatedAt: new Date().toISOString(),
		}

		await this.writeProfile(updatedProfile)
		return updatedProfile
	}

	async deleteExperience(id: string, experienceId: string): Promise<UserProfile | null> {
		const currentProfile = await this.readProfile()

		if (!currentProfile || currentProfile.id !== id) {
			return null
		}

		const updatedProfile: UserProfile = {
			...currentProfile,
			experience: currentProfile.experience.filter((exp) => exp.id !== experienceId),
			updatedAt: new Date().toISOString(),
		}

		await this.writeProfile(updatedProfile)
		return updatedProfile
	}
}
