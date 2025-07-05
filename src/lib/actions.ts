'use server'
import { ResumeService } from './ResumeService'
import { ProfileService } from './ProfileService'
import OpenAI from 'openai'
import { Resume } from './types'
import { v4 } from 'uuid'

type CurrentState = {
	success: boolean
	error: boolean
	data: any
}
export const createResume = async (currentState: CurrentState, formData: FormData) => {
	const data: any = Object.fromEntries(formData)

	const resumeSerivce = new ResumeService()
	const newResume = await resumeSerivce.createResume({
		title: data.title,
		description: data.description,
		workExperiences: [],
		educations: [],
		skills: [],
	})

	return { success: true, error: false, data: { id: newResume.id } }
}

export const createResumeWithJD = async (currentState: CurrentState, formData: FormData) => {
	const data: any = Object.fromEntries(formData)
	const resumeService = new ResumeService()
	const profileService = new ProfileService()
	await resumeService.ResumeService()
	await profileService.ProfileService()

	const profileData = await profileService.getProfile()
	const jdData = data.description as string

	if (!profileData) {
		throw new Error('Không tìm thấy dữ liệu hồ sơ người dùng')
	}

	if (!jdData) {
		throw new Error('Không tìm thấy mô tả công việc')
	}

	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY, // Đảm bảo biến môi trường được thiết lập
	})

	const prompt = `
    Bạn là một trợ lý AI chuyên nghiệp trong việc tạo hồ sơ ứng tuyển (resume) dựa trên mô tả công việc (job description) và thông tin hồ sơ người dùng. Dựa trên dữ liệu sau, hãy tạo một đối tượng JSON phù hợp với giao diện TypeScript sau:

    interface Resume {
      id: string
      title?: string
      description?: string
      photoId?: string
      summary?: string
      firstName?: string
      lastName?: string
      jobTitle?: string
      city?: string
      country?: string
      phone?: string
      email?: string
      workExperiences: WorkExperience[]
      educations: Education[]
      skills: string[]
      createdAt: string
      updatedAt: string
      fontFamily?: string
      bgColor?: string
      primaryColor?: string
      secondaryColor?: string
      textColor?: string
      selectedLayoutIndex?: number
      selectedStyleIndex?: number
      photoData?: string
    }

    interface WorkExperience {
      id?: string
      company: string
      position: string
      startDate: string
      endDate?: string
      description: string
    }

    interface Education {
      id: string
      institution: string
      degree: string
      startDate: string
      endDate?: string
    }

    **Dữ liệu đầu vào:**
    - **Mô tả công việc (jdData):** ${jdData}
    - **Thông tin hồ sơ người dùng (profileData):**
      - firstName: ${profileData.firstName}
      - lastName: ${profileData.lastName}
      - phone: ${profileData.phone}
      - email: ${profileData.email}
      - city: ${profileData.city}
      - country: ${profileData.country}
      - job: ${profileData.job}
      - education: ${JSON.stringify(profileData.education)}
      - experience: ${JSON.stringify(profileData.experience)}
      - additionalInfo: ${profileData.additionalInfo}

    **Yêu cầu:**
    - Tạo một đối tượng Resume mới dựa trên mô tả công việc và hồ sơ người dùng.
    - Sử dụng thông tin từ profileData để điền các trường firstName, lastName, phone, email, city, country, jobTitle, educations, workExperiences.
    - Tạo một summary ngắn gọn (2-3 câu) dựa trên mô tả công việc và thông tin hồ sơ, nhấn mạnh kỹ năng và kinh nghiệm phù hợp.
    - Tạo danh sách skills (5-10 kỹ năng) phù hợp với mô tả công việc.
    - Chọn fontFamily từ các lựa chọn phổ biến (ví dụ: Arial, Times New Roman, Helvetica, Roboto).
    - Chọn bgColor, primaryColor, secondaryColor, textColor (dưới dạng mã hex) sao cho phù hợp và thẩm mỹ với một resume chuyên nghiệp.
    - Đặt selectedStyleIndex là 0 hoặc 1 (hãy random để đa dạng cv).
    - Đặt selectedLayoutIndex là 0-3 (hãy random để đa dạng cv).
    - Đặt photoData là chuỗi rỗng ("").
    - Đặt createdAt và updatedAt là thời gian hiện tại (dạng ISO string).
    - Đảm bảo workExperiences và educations có id cho mỗi phần tử (sử dụng uuid).
    - Trả về đối tượng JSON hoàn chỉnh.
	- Dữ liệu đều là tiếng Việt

    **Trả về:**
    Một đối tượng JSON đúng định dạng của interface Resume.
  `

	try {
		const completion = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: 'Bạn là một trợ lý AI chuyên nghiệp.' },
				{ role: 'user', content: prompt },
			],
			response_format: { type: 'json_object' },
		})

		const aiResponse = JSON.parse(completion.choices[0].message.content || '{}') as Resume

		// Đảm bảo các trường bắt buộc được điền và định dạng đúng
		const newResume: Resume = {
			id: v4(),
			title: data.title || 'Resume',
			description: aiResponse.description || jdData.substring(0, 200), // Rút ngắn JD nếu cần
			photoId: aiResponse.photoId,
			summary:
				aiResponse.summary ||
				`Professional ${profileData.job} with experience in relevant fields, seeking opportunities to apply skills in ${jdData.split(' ').slice(0, 3).join(' ')}.`,
			firstName: profileData.firstName,
			lastName: profileData.lastName,
			jobTitle: profileData.job,
			city: profileData.city,
			country: profileData.country,
			phone: profileData.phone,
			email: profileData.email,
			workExperiences: (aiResponse.workExperiences || profileData.experience).map((we) => ({
				...we,
				id: we.id || v4(),
			})),
			educations: (aiResponse.educations || profileData.education).map((edu) => ({
				...edu,
				id: edu.id || v4(),
			})),
			skills: aiResponse.skills || [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			fontFamily: aiResponse.fontFamily || 'Arial',
			bgColor: aiResponse.bgColor || '#FFFFFF',
			primaryColor: aiResponse.primaryColor || '#444444',
			secondaryColor: aiResponse.secondaryColor || '#777777',
			textColor: aiResponse.textColor || '#000000',
			selectedLayoutIndex: aiResponse.selectedLayoutIndex ?? Math.floor(Math.random() * 2), // 0 hoặc 1
			selectedStyleIndex: aiResponse.selectedStyleIndex ?? Math.floor(Math.random() * 2), // 0 hoặc 1
			photoData: '',
		}

		// Lưu resume vào cơ sở dữ liệu
		const savedResume = await resumeService.createResume(newResume)
		return { success: true, error: false, data: { id: savedResume.id } }
	} catch (error) {
		console.error('Lỗi khi tạo resume với OpenAI:', error)
		throw new Error('Không thể tạo resume. Vui lòng thử lại.')
	}
}
