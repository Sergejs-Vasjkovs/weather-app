import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("favorites/toggle", "routes/favorites.toggle.tsx"),
    route("search", "routes/search.tsx"),
    route("city/:slug", "routes/city.$slug.tsx"),
    route("*", "routes/NotFound.tsx"),
] satisfies RouteConfig;
