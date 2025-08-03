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
      },
      {
        protocol: 'https',
        hostname: 'i.dummyjson.com',
        pathname: '/data/products/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      }
    ],
    domains: ['localhost'],
    dangerouslyAllowSVG: true,
    unoptimized: true
  }
};

export default nextConfig;
