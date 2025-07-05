import { ResumeService } from '@/lib/ResumeService'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const resumeService = new ResumeService()
		const resumes = await resumeService.getAllResumes()
		if (!resumes) {
			return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
		}
		return NextResponse.json(resumes)
	} catch (error) {
		console.error('Error getting resume data:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
