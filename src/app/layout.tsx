import Navbar from '@/components/Navbar'
import './globals.css'
import { Suspense } from 'react'
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
				<br />
				<br />
				<Suspense>{children}</Suspense>
				<ToastContainer theme="dark" position="bottom-right" />
			</body>
		</html>
	)
}
