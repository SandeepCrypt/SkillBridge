import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["firebase-admin"],
  allowedDevOrigins: [
    '192.168.56.1',
    'amuser-afternoon-blurred.ngrok-free.dev',
    '*.ngrok-free.dev', // wildcard so you don't have to update this every time ngrok gives you a new subdomain
  ],
};

export default nextConfig;