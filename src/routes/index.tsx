import { createFileRoute } from "@tanstack/react-router";
import { DashboardScreen } from "../ui/screens/DashboardScreen";

type DashboardSearch = {
  program?: boolean;
};

export const Route = createFileRoute("/")({
  validateSearch: (raw: Record<string, unknown>): DashboardSearch => {
    const value = raw["program"];
    if (value === true || value === "true" || value === "1") {
      return { program: true };
    }
    return {};
  },
  head: () => ({
    meta: [
      { title: "ØKT – Ukeprogram" },
      {
        name: "description",
        content: "Oversikt over ukens treningsdager og øvelser. Åpne en økt med timer og hvile.",
      },
      { property: "og:title", content: "ØKT – Ukeprogram" },
      {
        property: "og:description",
        content: "Oversikt over ukens treningsdager og øvelser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#1C1A14" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
    ],
  }),
  component: DashboardRoute,
});

function DashboardRoute() {
  const search = Route.useSearch();
  return <DashboardScreen stayOnProgram={search.program === true} />;
}
