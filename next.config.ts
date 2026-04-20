import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["postgres", "nodemailer"],
  allowedDevOrigins: ["172.20.10.2"],
};

export default nextConfig;
