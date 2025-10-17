import withPWA from 'next-pwa';
import createNextIntlPlugin from 'next-intl/plugin';

// Basic CSP; can be tightened further as needed
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
].join('; ');

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {},
  env: {},
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=()' }
        ]
      }
    ];
  }
};

// In next-intl v4, the plugin can be used without an explicit config path
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withPWA({
  dest: 'public',
  // Temporarily disable PWA to rule out SW-cached 404
  disable: true,
  runtimeCaching: [
    // With PWA disabled, runtimeCaching has no effect but we keep it for later
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'static-resources' }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
      handler: 'CacheFirst',
      options: { cacheName: 'images', expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 } }
    }
  ]
})(baseConfig));
