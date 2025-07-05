import { NextResponse } from 'next/server'
import { ProfileService } from '@/lib/ProfileService'

const profileService = new ProfileService()

export async function POST(request: Request) {
	try {
		const { id, experience } = await request.json()
		const updatedProfile = await profileService.addExperience(id, experience)
		if (!updatedProfile) {
			return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
		}
		return NextResponse.json(updatedProfile)
	} catch (error) {
		return NextResponse.json({ error: 'Failed to add experience' }, { status: 500 })
	}
}

export async function PUT(request: Request) {
	try {
		const { id, experienceId, experienceData } = await request.json()
		const updatedProfile = await profileService.updateExperience(id, experienceId, experienceData)
		if (!updatedProfile) {
			return NextResponse.json({ error: 'Profile or experience not found' }, { status: 404 })
		}
		return NextResponse.json(updatedProfile)
	} catch (error) {
		return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
	}
}

export async function DELETE(request: Request) {
	try {
		const { id, experienceId } = await request.json()
		const updatedProfile = await profileService.deleteExperience(id, experienceId)
		if (!updatedProfile) {
			return NextResponse.json({ error: 'Profile or experience not found' }, { status: 404 })
		}
		return NextResponse.json(updatedProfile)
	} catch (error) {
		return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
	}
}
