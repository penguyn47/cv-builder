const features = [
	{
		title: 'AI thông minh',
		description: 'AI phân tích job description và tự động tối ưu nội dung CV phù hợp với vị trí ứng tuyển.',
		icon: '/ai_icon.png',
	},
	{
		title: 'ATS Scoring',
		description: 'Kiểm tra và tối ưu CV để vượt qua hệ thống ATS của các công ty, tăng cơ hội được mời phỏng vấn.',
		icon: '/at_icon.png',
	},
	{
		title: '50+ Mẫu CV đẹp',
		description: 'Thư viện mẫu CV đa dạng, thiết kế bởi chuyên gia HR phù hợp với mọi ngành nghề.',
		icon: '/cv_template.png',
	},
	{
		title: 'Xuất PDF chất lượng cao',
		description: 'Tải CV dưới định dạng PDF với chất lượng chuyên nghiệp, sẵn sàng gửi cho nhà tuyển dụng.',
		icon: '/pdf.png',
	},
	{
		title: 'Hỗ trợ 24/7',
		description: 'Đội ngũ chuyên gia HR hỗ trợ bạn tạo CV hoàn hảo và tư vấn chiến lược tìm việc.',
		icon: '/247.png',
	},
	{
		title: 'Đánh giá thực tế',
		description: 'Nhận feedback chi tiết về CV để cải thiện cơ hội thành công.',
		icon: '/feedback.png',
	},
]

export default function Home() {
	return (
		<div className="font-sans text-gray-900">
			{/* HERO */}
			<section className="flex flex-col items-center justify-between bg-gray-100 p-12 md:flex-row">
				<div className="flex-[1] p-8">
					<h1 className="mb-2 font-bold lg:text-4xl">
						Tạo CV chuyên nghiệp trong <span className="text-gray-500">vài phút</span>
					</h1>
					<p className="mt-5 mb-2 text-sm font-semibold text-gray-500 lg:text-[1.4rem]">
						Sáng tạo CV với AI – nhanh chóng, đơn giản, chuyên nghiệp
					</p>
					<p className="text-sm lg:text-[1.1rem]">
						Sử dụng AI thông minh để tạo CV ấn tượng, vượt qua ATS và thu hút nhà tuyển dụng. Hơn 50+ mẫu CV đẹp, xuất
						PDF chất lượng cao.
					</p>
					<div className="mt-6 flex gap-4">
						<button className="rounded-md bg-gray-600 px-4 py-1 text-sm text-white lg:px-7 lg:py-2.5 lg:text-base">
							Bắt đầu viết CV
						</button>
						<button className="rounded-md border border-black px-4 py-1 lg:px-6 lg:py-2.5 lg:text-base">
							Cập nhật CV
						</button>
					</div>
					<div className="mt-4 flex items-center">
						<img src="/tick.png" alt="tick" className="mr-2 w-4" />
						<small>Miễn phí thử nghiệm</small>
					</div>
				</div>
				<img src="/teamwork.png" alt="Team working" className="w-[90%] flex-[1] p-4 text-center md:w-[60%] xl:w-3xl" />
			</section>

			{/* WHY SECTION */}
			<section className="bg-gray-200 px-4 py-12 text-center">
				<h2 className="mb-2 text-[2rem] font-bold">Tại sao chọn CVPro?</h2>
				<p className="mb-6 text-base text-[1.1rem]">
					Chúng tôi kết hợp công nghệ AI tiên tiến với thiết kế chuyên nghiệp để tạo ra CV hoàn hảo cho bạn.
				</p>
				<div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{features.map((f, i) => (
						<div key={i} className="rounded-lg bg-white p-6 pb-17 text-left shadow">
							<img src={f.icon} alt={f.title} className="mb-4 h-12 w-12" />
							<h3 className="mb-2 text-[1.25rem] font-bold">{f.title}</h3>
							<p className="text-[0.95rem] text-gray-700">{f.description}</p>
						</div>
					))}
				</div>
			</section>

			{/* CTA BOTTOM */}
			<section className="bg-gray-600 px-4 py-12 text-center text-white">
				<h2 className="mb-2 text-2xl font-bold">Sẵn sàng tạo CV ấn tượng?</h2>
				<p>Hàng nghìn ứng viên đã thành công với CVPro. Bắt đầu hành trình sự nghiệp mới của bạn ngay hôm nay!</p>
				<button className="mt-6 rounded border-2 border-white bg-white px-6 py-3 font-bold text-gray-600">
					+ Tạo CV mới
				</button>
			</section>
		</div>
	)
}
