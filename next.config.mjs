/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.samsung.com',
        pathname: '/is/image/samsung/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'oasis.opstatics.com',
        pathname: '/content/dam/oasis/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/photo-**',
      }
    ],
  },
};

export default nextConfig;
