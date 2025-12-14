import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "agri-promis",
    name: "Agri-ProMIS",
    short_name: "Agri-ProMIS",
    description:
      "A Progressive Web App built for Agricultural Project Monitoring and Implementation",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    lang: "en",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    categories: ["productivity", "business"],
    screenshots: [],
  };
}
