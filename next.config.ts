import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/affiliate-sign-up",
      destination: "https://sipai-legal.web.app/qa/",
      permanent: false,
    },
    {
      source: "/affiliate",
      destination: "https://sipai-legal.web.app/qa/",
      permanent: false,
    },
  ],
};

export default nextConfig;
