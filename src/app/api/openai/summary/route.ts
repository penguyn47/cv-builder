import { NextResponse } from 'next/server'
import OpenAI from 'openai'

interface RequestBody {
	resumeData: string
}

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request): Promise<NextResponse> {
	try {
		// Parse request body
		const { resumeData: data }: RequestBody = await request.json()

		const resumeData = JSON.stringify(data)
		// Validate input
		if (!resumeData) {
			return NextResponse.json({ error: 'Vui lòng cung cấp dữ liệu hồ sơ hợp lệ' }, { status: 400 })
		}

		const prompt = `
      Bạn là một trợ lý AI chuyên viết tổng quan hồ sơ (summary) chuyên nghiệp bằng tiếng Việt. 
      Nhiệm vụ: Dựa trên dữ liệu hồ sơ được cung cấp, tạo một đoạn văn tổng quan ngắn gọn (50-100 từ), 
      nhấn mạnh các kỹ năng, kinh nghiệm, học vấn và mục tiêu nghề nghiệp chính. 
      Sử dụng giọng điệu trang trọng, súc tích, phù hợp với hồ sơ xin việc. 
      Tránh sử dụng từ ngữ chung chung, tập trung vào các điểm nổi bật của ứng viên.
      Xưng hô dưới góc nhìn của người được mô tả. (tôi)

      Dữ liệu hồ sơ:
      ${resumeData}

      Trả về kết quả dưới dạng JSON với trường "summary" chứa đoạn văn tổng quan.
    `

		// Send request to OpenAI
		const completion = await openai.chat.completions.create({
			model: 'gpt-4o-mini', // Updated to a more recent model for better performance
			messages: [
				{ role: 'system', content: prompt },
				{ role: 'user', content: resumeData },
			],
			response_format: { type: 'json_object' },
			max_tokens: 200, // Limit output length
			temperature: 0.7, // Balanced creativity for professional tone
		})

		const content = completion.choices[0]?.message.content
		if (!content) {
			return NextResponse.json({ error: 'Không nhận được nội dung từ OpenAI' }, { status: 500 })
		}

		// Parse and validate OpenAI response
		let summaryData
		try {
			summaryData = JSON.parse(content)
			if (!summaryData.summary) {
				throw new Error('Missing summary field in OpenAI response')
			}
		} catch (parseError) {
			console.error('Error parsing OpenAI response:', parseError)
			return NextResponse.json({ error: 'Định dạng phản hồi từ OpenAI không hợp lệ' }, { status: 500 })
		}

		// Return successful response
		return NextResponse.json({ summary: summaryData.summary }, { status: 200 })
	} catch (error: unknown) {
		console.error('Lỗi khi xử lý yêu cầu:', error)
		return NextResponse.json({ error: 'Lỗi server nội bộ' }, { status: 500 })
	}
}
