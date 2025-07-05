import { readFile, writeFile } from 'fs/promises'
import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { Hint } from './types'

const HINTS_FILE = path.join(process.cwd(), 'data', 'hints.json')

export class HintService {
	constructor() {
		this.initializeHintsFile()
	}

	private async initializeHintsFile(): Promise<void> {
		try {
			await fs.access(HINTS_FILE)
		} catch {
			await fs.mkdir(path.dirname(HINTS_FILE), { recursive: true })
			await fs.writeFile(HINTS_FILE, JSON.stringify([]))
		}
	}

	private async readHints(): Promise<Hint[]> {
		try {
			const data = await readFile(HINTS_FILE, 'utf-8')
			return JSON.parse(data) as Hint[]
		} catch (error) {
			return []
		}
	}

	private async writeHints(hints: Hint[]): Promise<void> {
		await writeFile(HINTS_FILE, JSON.stringify(hints, null, 2))
	}

	async getHints(): Promise<Hint[]> {
		return await this.readHints()
	}

	async getHintsByResumeIdAndPart(resumeId: string, part?: Hint['part']): Promise<Hint[]> {
		const hints = await this.readHints()
		return hints.filter((hint) => hint.resumeId === resumeId && (!part || hint.part === part))
	}

	async createHint(hintData: Omit<Hint, 'id' | 'createdAt' | 'updatedAt'>): Promise<Hint> {
		const newHint: Hint = {
			id: uuidv4(),
			...hintData,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}

		const hints = await this.readHints()
		hints.push(newHint)
		await this.writeHints(hints)
		return newHint
	}

	async updateHint(
		id: string,
		updateData: Partial<Omit<Hint, 'id' | 'createdAt' | 'updatedAt'>>,
	): Promise<Hint | null> {
		const hints = await this.readHints()
		const hintIndex = hints.findIndex((hint) => hint.id === id)

		if (hintIndex === -1) {
			return null
		}

		const updatedHint: Hint = {
			...hints[hintIndex],
			...updateData,
			updatedAt: new Date().toISOString(),
		}

		hints[hintIndex] = updatedHint
		await this.writeHints(hints)
		return updatedHint
	}

	async deleteHint(id: string): Promise<boolean> {
		const hints = await this.readHints()
		const hintIndex = hints.findIndex((hint) => hint.id === id)

		if (hintIndex === -1) {
			return false
		}

		hints.splice(hintIndex, 1)
		await this.writeHints(hints)
		return true
	}
}
