import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'i.pravatar.cc',
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true, // Skips ESLint during builds
	},
}

export default nextConfig
