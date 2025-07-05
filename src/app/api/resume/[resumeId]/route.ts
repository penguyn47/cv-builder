import { NextRequest, NextResponse } from 'next/server'
import { ResumeService } from '@/lib/ResumeService'

export async function PUT(request: NextRequest, context: { params: Promise<{ resumeId: string }> }) {
	try {
		const params = await context.params
		const data = await request.json()
		const resumeService = new ResumeService()
		const updatedResume = await resumeService.updateResume(params.resumeId, data)
		if (!updatedResume) {
			return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
		}
		return NextResponse.json(updatedResume)
	} catch (error) {
		console.error('Error updating resume:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function GET(request: NextRequest, context: { params: Promise<{ resumeId: string }> }) {
	try {
		const params = await context.params
		const resumeService = new ResumeService()
		const resume = await resumeService.getResumeById(params.resumeId)
		if (!resume) {
			return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
		}
		return NextResponse.json(resume)
	} catch (error) {
		console.error('Error getting resume data:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ resumeId: string }> }) {
	try {
		const params = await context.params
		const resumeService = new ResumeService()
		const resume = await resumeService.deleteResume(params.resumeId)
		if (!resume) {
			return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
		}
		return NextResponse.json(resume)
	} catch (error) {
		console.error('Error deleting resume data:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
