import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { Header } from "~/components/Header";
import { FavoritesProvider } from "~/contexts/FavoritesContext";
import { prisma } from "~/db.server";
import { THEME_KEY } from "~/constants";
import type { Route } from "./+types/root";
import "./app.css";
import { NotFound } from "./routes/NotFound";

export async function loader() {
    const favoriteCities = await prisma.favoriteCity.findMany({
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true, lat: true, lon: true, createdAt: true },
    });
    return { favoriteCities };
}

const THEME_SCRIPT = `
  (function() {
    var key = '${THEME_KEY}';
    var theme = localStorage.getItem(key);
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.toggle('dark', theme === 'dark');
  })();
`;

export const links: Route.LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
                <Meta />
                <Links />
            </head>
            <body>
                <Header />
                <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-16 lg:max-w-7xl lg:px-8">
                    {children}
                </main>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <FavoritesProvider>
            <Outlet />
        </FavoritesProvider>
    );
}

export function ErrorBoundary() {
    return <NotFound />;
}
