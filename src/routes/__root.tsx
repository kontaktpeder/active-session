import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex h-full items-center justify-center bg-background px-4">
      <div className="max-w-md min-w-0 text-center">
        <h1 className="display text-7xl text-foreground">404</h1>
        <h2 className="display mt-4 text-2xl text-foreground">Siden finnes ikke</h2>
        <p className="mt-2 text-sm text-muted-foreground">Gå tilbake til ukeprogrammet.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="display inline-flex min-h-11 items-center justify-center bg-primary px-5 text-sm tracking-[0.16em] text-primary-foreground"
          >
            Program
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex h-full items-center justify-center bg-background px-4">
      <div className="max-w-md min-w-0 text-center">
        <h1 className="display text-2xl text-foreground">Siden lastet ikke</h1>
        <p className="mt-2 text-sm text-muted-foreground">Noe gikk galt. Prøv på nytt eller gå til programmet.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="display inline-flex min-h-11 items-center justify-center bg-primary px-5 text-sm tracking-[0.16em] text-primary-foreground"
          >
            Prøv igjen
          </button>
          <a
            href="/"
            className="display inline-flex min-h-11 items-center justify-center border border-border bg-card px-5 text-sm tracking-[0.16em] text-foreground"
          >
            Program
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1",
      },
      { title: "ØKT" },
      { name: "description", content: "Treningsapp med fast ukeprogram og mastertimer." },
      { name: "author", content: "ØKT" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { property: "og:title", content: "ØKT" },
      { property: "og:description", content: "Treningsapp med fast ukeprogram og mastertimer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&family=IBM+Plex+Mono:wght@500;600&family=Oswald:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="nb">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div data-vaul-drawer-wrapper="" className="h-full overflow-hidden bg-background">
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}
