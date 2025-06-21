import Navbar from '@/components/Navbar'
import './globals.css'
import { ToastContainer } from 'react-toastify'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>
				<Navbar />
				<div>{children}</div>
				<ToastContainer theme="dark" position="bottom-right" />
			</body>
		</html>
	)
}
