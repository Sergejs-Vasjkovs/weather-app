export type FavoriteCity = {
    id: number;
    name: string;
    lat: number | null;
    lon: number | null;
    createdAt: Date;
};

export type RootLoaderData = {
    favoriteCities: FavoriteCity[];
};

export type FavoritesToggleResult =
    | { ok: true; state: "added" | "removed" }
    | { ok: false; error?: string };
