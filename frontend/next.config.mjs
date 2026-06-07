/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://moneywise-saxophone-steadier.ngrok-free.dev/:path*',
      },
    ];
  },
};

export default nextConfig;
