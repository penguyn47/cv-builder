import { NextRequest, NextResponse } from 'next/server'
import { HintService } from '@/lib/HintService'
import { Hint } from '@/lib/types'

const hintService = new HintService()

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const resumeId = searchParams.get('resumeId')
		const part = searchParams.get('part') as Hint['part'] | undefined

		if (!resumeId) {
			return NextResponse.json({ error: 'resumeId is required' }, { status: 400 })
		}

		const hints: Hint[] = await hintService.getHintsByResumeIdAndPart(resumeId, part)
		return NextResponse.json(hints, { status: 200 })
	} catch (error) {
		console.error('Error fetching hints:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const hintId = searchParams.get('hintId')

		if (!hintId) {
			return NextResponse.json({ error: 'hintId is required' }, { status: 400 })
		}

		const success = await hintService.deleteHint(hintId)
		if (success) {
			return NextResponse.json({ message: 'Hint deleted successfully' }, { status: 200 })
		} else {
			return NextResponse.json({ error: 'Hint not found' }, { status: 404 })
		}
	} catch (error) {
		console.error('Error deleting hint:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
