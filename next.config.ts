import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Always render <title>/<meta> in <head> (Next 15 otherwise streams metadata
  // into <body> for non-bot user agents on dynamic renders, which some SEO
  // auditors miss). No cost for this single static page.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
