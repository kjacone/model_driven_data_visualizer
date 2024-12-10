/** @type {import('next').NextConfig} */
const nextConfig = {
  
  async headers() {
    return [
      {
      // Apply these headers to all routes
      source: '/:path*',
      headers: [
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp',
        },
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
        // Additional recommended security headers
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        }
      ],
    },
    // Additional header for WebContainer assets
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp',
        },
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        }
      ],
    
    }
    ]
  },
   // Preserve existing Next.js config options
   reactStrictMode: true,
   swcMinify: true
};


export default nextConfig;