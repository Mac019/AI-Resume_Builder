import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      buffer: require.resolve('buffer/'),
      worker_threads: false,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      util: false,
    };
    return config;
  },
};

export default nextConfig;
