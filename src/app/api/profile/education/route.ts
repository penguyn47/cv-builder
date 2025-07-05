import { NextResponse } from 'next/server'
import { ProfileService } from '@/lib/ProfileService'

const profileService = new ProfileService()

export async function POST(request: Request) {
	try {
		const { id, education } = await request.json()
		const updatedProfile = await profileService.addEducation(id, education)
		if (!updatedProfile) {
			return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
		}
		return NextResponse.json(updatedProfile)
	} catch (error) {
		return NextResponse.json({ error: 'Failed to add education' }, { status: 500 })
	}
}

export async function PUT(request: Request) {
	try {
		const { id, educationId, educationData } = await request.json()
		const updatedProfile = await profileService.updateEducation(id, educationId, educationData)
		if (!updatedProfile) {
			return NextResponse.json({ error: 'Profile or education not found' }, { status: 404 })
		}
		return NextResponse.json(updatedProfile)
	} catch (error) {
		return NextResponse.json({ error: 'Failed to update education' }, { status: 500 })
	}
}

export async function DELETE(request: Request) {
	try {
		const { id, educationId } = await request.json()
		const updatedProfile = await profileService.deleteEducation(id, educationId)
		if (!updatedProfile) {
			return NextResponse.json({ error: 'Profile or education not found' }, { status: 404 })
		}
		return NextResponse.json(updatedProfile)
	} catch (error) {
		return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 })
	}
}
