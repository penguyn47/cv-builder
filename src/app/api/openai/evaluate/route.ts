import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { HintService } from '@/lib/HintService'
import { Resume } from '@/lib/types'

// Định nghĩa interface cho request body
interface RequestBody {
	resumeData: Resume
	jobDescription: string
}

// Định nghĩa interface cho hint
interface Hint {
	type: 'success' | 'notice'
	part: 'generalInfo' | 'experience' | 'education' | 'skills' | 'summary'
	content: string
}

// Khởi tạo OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

// Khởi tạo HintService
const hintService = new HintService()

// Xử lý POST request
export async function POST(request: Request): Promise<NextResponse> {
	try {
		// Lấy dữ liệu từ request body
		const { resumeData, jobDescription }: RequestBody = await request.json()

		// Kiểm tra xem resumeData và jobDescription có được cung cấp không
		if (!resumeData || !jobDescription) {
			return NextResponse.json({ error: 'Vui lòng cung cấp resumeData và jobDescription' }, { status: 400 })
		}

		// Tạo prompt bằng tiếng Việt
		const prompt = `
      Bạn là một chuyên gia phân tích hồ sơ ứng tuyển bằng tiếng Việt. Nhiệm vụ của bạn là đánh giá hồ sơ (resume) so với mô tả công việc (job description) và tạo ra các gợi ý (hints) để cải thiện hồ sơ. Mỗi gợi ý phải thuộc một trong các phần sau: generalInfo, experience, education, skills, summary. Gợi ý có thể là:

      - "success": Chỉ ra những điểm mạnh của hồ sơ, phù hợp với mô tả công việc.
      - "notice": Đề xuất chỉnh sửa để hồ sơ phù hợp hơn với mô tả công việc.

      Hãy trả về một danh sách các gợi ý theo chính xác định dạng JSON sau:
      {
        "hints":
        [
            {
            "type": "success" | "notice",
            "part": "generalInfo" | "experience" | "education" | "skills" | "summary",
            "content": "Nội dung gợi ý"
            },
            ...
        ]
      }
      Nếu không có thông tin cụ thể, hãy suy luận hợp lý và tạo gợi ý mang tính chuyên nghiệp.

      **Mô tả công việc**:
      ${jobDescription}

      **Hồ sơ**:
      ${JSON.stringify(resumeData, null, 2)}
    `

		// Gửi yêu cầu đến OpenAI
		const completion = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: 'Bạn là một chuyên gia phân tích hồ sơ ứng tuyển.' },
				{ role: 'user', content: prompt },
			],
			response_format: { type: 'json_object' }, // Yêu cầu output dạng JSON
		})

		// Lấy kết quả từ OpenAI
		const content = completion.choices[0]?.message.content
		if (!content) {
			return NextResponse.json({ error: 'Không nhận được nội dung từ OpenAI' }, { status: 500 })
		}

		console.log(content)

		// Parse JSON an toàn

		let hints: Hint[]
		try {
			const parsedContent = JSON.parse(content)
			hints = Array.isArray(parsedContent) ? parsedContent : parsedContent['hints'] || []
			if (!Array.isArray(hints)) {
				throw new Error('Dữ liệu trả về không phải là mảng')
			}
		} catch (parseError) {
			console.error('Lỗi khi parse JSON:', parseError)
			return NextResponse.json({ error: 'Dữ liệu từ OpenAI không đúng định dạng mảng' }, { status: 500 })
		}

		// Lưu các hint vào HintService
		for (const hint of hints) {
			await hintService.createHint({
				resumeId: resumeData.id,
				type: hint.type,
				content: hint.content,
				part: hint.part,
			})
		}

		// Trả về kết quả
		return NextResponse.json({ message: 'Đánh giá hoàn tất, các gợi ý đã được lưu.' }, { status: 200 })
	} catch (error: unknown) {
		console.error('Lỗi khi xử lý yêu cầu:', error)
		return NextResponse.json({ error: 'Lỗi server nội bộ' }, { status: 500 })
	}
}
