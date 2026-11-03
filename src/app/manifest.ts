import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ordi'Space Maintenancier",
    short_name: "Maintenancier",
    description: "Espace Technicien de maintenance OrdiSpace.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f2f5fa",
    theme_color: "#1d63e0",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
