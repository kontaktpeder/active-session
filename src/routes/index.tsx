import { createFileRoute } from "@tanstack/react-router";
import { App } from "../ui/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ØKT – Treningsøkt med mastertimer" },
      {
        name: "description",
        content:
          "ØKT er en enkel treningsapp med fast ukeprogram, mastertimer, hvileklokke og lokal øktlagring.",
      },
      { property: "og:title", content: "ØKT – Treningsøkt med mastertimer" },
      {
        property: "og:description",
        content: "Fast ukeprogram, mastertimer og hvileklokke. Alt lagres lokalt på telefonen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0B0D10" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
    ],
  }),
  component: App,
});
