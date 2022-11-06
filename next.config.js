/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    BACKEND_URL: 'https://localhost:7105'
  }
}

module.exports = nextConfig
