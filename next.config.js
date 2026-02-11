/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable standalone since Railway uses regular build
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

module.exports = nextConfig