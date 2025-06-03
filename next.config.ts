/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002',
    INTERNAL_API_URL: process.env.INTERNAL_API_URL || 'http://localhost:8002',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/:path*`,
      },
    ];
  },
  experimental: {
    serverActions: {},
  }
}

export default config
