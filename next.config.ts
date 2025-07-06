import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
    devIndicators: false,
    // compress: true,
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'sample-bucket.s3.localhost.localstack.cloud',
                port: '4566',
                pathname: '/**',
                search: '',
            },
        ],
    },
	output: 'export',
    distDir: 'dist/out'
}
 
export default nextConfig