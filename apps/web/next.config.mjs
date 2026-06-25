/** @type {import('next').NextConfig} */

const isImageUnoptimized =
  process.env.NEXT_PUBLIC_DISABLE_IMAGE_OPTIMIZATION === "true"

const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    unoptimized: isImageUnoptimized,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.ophim.live",
        port: "",
        pathname: "/uploads/movies/**",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
