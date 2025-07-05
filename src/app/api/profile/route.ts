import { NextResponse } from 'next/server'
import { ProfileService } from '@/lib/ProfileService'

const profileService = new ProfileService()

export async function GET() {
	try {
		await profileService.ProfileService()
		const profile = await profileService.getProfile()
		return NextResponse.json(profile || {})
	} catch (error) {
		return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
	}
}

export async function POST(request: Request) {
	try {
		const profileData = await request.json()
		const newProfile = await profileService.createProfile(profileData)
		return NextResponse.json(newProfile)
	} catch (error) {
		return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
	}
}

export async function PUT(request: Request) {
	try {
		const { id, ...updateData } = await request.json()
		const updatedProfile = await profileService.updateProfile(id, updateData)
		if (!updatedProfile) {
			return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
		}
		return NextResponse.json(updatedProfile)
	} catch (error) {
		return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
	}
}

export async function DELETE(request: Request) {
	try {
		const { id } = await request.json()
		const success = await profileService.deleteProfile(id)
		if (!success) {
			return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
		}
		return NextResponse.json({ message: 'Profile deleted' })
	} catch (error) {
		return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 })
	}
}
