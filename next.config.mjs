const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Capacitor builds
  ...(isCapacitorBuild && { output: 'export' }),

  // Enable compression for better performance
  compress: true,
  
  // Headers for security and SEO (not supported in static export)
  ...(!isCapacitorBuild && {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on'
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin'
            },
          ],
        },
      ];
    },
  }),
  
  // Image optimization
  images: {
    // Capacitor static export requires unoptimized images
    ...(isCapacitorBuild && { unoptimized: true }),
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'product-cdn.systembolaget.se',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
