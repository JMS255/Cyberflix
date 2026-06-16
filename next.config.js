/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://image.tmdb.org https:",
              "media-src 'self' https:",
              "connect-src 'self' https://api.themoviedb.org",
              [
                "frame-src 'self'",
                "https://vidsrc.to",
                "https://vidsrc.me",
                "https://www.2embed.cc",
                "https://player.smashy.stream",
                "https://embed.smashystream.com",
              ].join(' '),
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'Referrer-Policy',
            value: 'origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
