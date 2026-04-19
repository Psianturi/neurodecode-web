import imageHostsConfig from './image-hosts.config.js';

const { imageHosts } = imageHostsConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  distDir: process.env.DIST_DIR || '.next',

  images: {
    remotePatterns: imageHosts,
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/homepage',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
