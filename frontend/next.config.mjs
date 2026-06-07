/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://dashboard-backend-627005186796.us-central1.run.app/:path*',
      },
    ];
  },
};

export default nextConfig;
