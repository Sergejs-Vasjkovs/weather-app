import { createContext, useContext } from "react";
import { useRouteLoaderData } from "react-router";
import type { FavoriteCity, RootLoaderData } from "~/types";

const FavoritesContext = createContext<FavoriteCity[]>([]);

export function useFavorites() {
    return useContext(FavoritesContext);
}

const normalizeCityName = (s: string) => s.toLowerCase().trim();

export function findFavoriteByCityName(
    cities: FavoriteCity[],
    cityName: string,
): FavoriteCity | null {
    const normalized = normalizeCityName(cityName);
    return cities.find((c) => normalizeCityName(c.name) === normalized) ?? null;
}

export function isCityInFavorites(cities: FavoriteCity[], cityName: string): boolean {
    return findFavoriteByCityName(cities, cityName) !== null;
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const data = useRouteLoaderData("root") as RootLoaderData | undefined;
    const cities = data?.favoriteCities ?? [];
    return <FavoritesContext.Provider value={cities}>{children}</FavoritesContext.Provider>;
}
