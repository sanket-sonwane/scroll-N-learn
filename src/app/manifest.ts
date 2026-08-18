import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ScrollLearn — Swipe-Based Technical Learning",
    short_name: "ScrollLearn",
    description:
      "Swipe-first technical learning. Tiny interactive cards that turn scrolling time into understanding.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0b0f",
    theme_color: "#0a0b0f",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}