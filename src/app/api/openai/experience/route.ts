import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Định nghĩa interface cho workExperience
interface WorkExperience {
	position: string
	company: string
	location: string
	startDate: string
	endDate: string
	description: string
}

// Định nghĩa interface cho request body
interface RequestBody {
	description: string
}

// Khởi tạo OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

// Xử lý POST request
export async function POST(request: Request): Promise<NextResponse> {
	try {
		// Lấy dữ liệu từ request body
		const { description }: RequestBody = await request.json()

		// Kiểm tra xem description có được cung cấp không
		if (!description) {
			return NextResponse.json({ error: 'Vui lòng cung cấp mô tả công việc' }, { status: 400 })
		}

		// Tạo prompt bằng tiếng Việt
		const prompt = `
      Bạn là một trợ lý AI chuyên phân tích mô tả công việc bằng tiếng Việt và trích xuất thông tin để tạo ra một đối tượng JSON. Đối tượng JSON cần có cấu trúc sau:
      {
        "position": "Chức danh công việc",
        "company": "Tên công ty",
        "startDate": "Ngày bắt đầu (ví dụ: 2025-06-28 format yyyy-mm-dd)",
        "endDate": "Ngày kết thúc (ví dụ: 2025-06-28 hoặc Hiện tại format yyyy-mm-dd)",
        "description": "Mô tả trách nhiệm và thành tựu."
      }
      Nếu thông tin nào không có trong văn bản, hãy tự suy luận ra trường đó với tone giọng chuyên nghiệp.
	  Tự suy luận các trường trước khi bỏ trống nó.

      Dưới đây là văn bản mô tả công việc:
      "${description}"

      Hãy trích xuất thông tin từ văn bản trên và trả về một đối tượng JSON.
    `

		// Gửi yêu cầu đến OpenAI
		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: prompt },
				{ role: 'user', content: description },
			],
			response_format: { type: 'json_object' }, // Yêu cầu output dạng JSON
		})

		// Lấy kết quả từ OpenAI

		const content = completion.choices[0]?.message.content
		if (!content) {
			return NextResponse.json({ error: 'Không nhận được nội dung từ OpenAI' }, { status: 500 })
		}

		// Parse JSON an toàn
		const workExperience: WorkExperience = JSON.parse(content)

		// Trả về kết quả
		return NextResponse.json(workExperience, { status: 200 })
	} catch (error: unknown) {
		console.error('Lỗi khi xử lý yêu cầu:', error)
		return NextResponse.json({ error: 'Lỗi server nội bộ' }, { status: 500 })
	}
}
