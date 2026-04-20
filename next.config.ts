import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["postgres", "nodemailer", "mercadopago"],
  allowedDevOrigins: ["172.20.10.2", "192.168.0.137"],
};

export default nextConfig;
