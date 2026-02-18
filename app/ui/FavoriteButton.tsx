import { useEffect } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { findFavoriteByCityName, useFavorites } from "~/contexts/FavoritesContext";
import { FAVORITES_TOGGLE_ACTION } from "~/constants";
import type { FavoritesToggleResult } from "~/types";

type FavoriteButtonProps = {
    name: string;
    lat: number;
    lon: number;
};

const FAVORITE_BUTTON_BASE =
    "rounded-full p-2 text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-70 dark:shadow-none";
const FAVORITE_BUTTON_ACTIVE =
    "bg-red-500 hover:bg-red-600 focus-visible:outline-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:focus-visible:outline-red-500";
const FAVORITE_BUTTON_INACTIVE =
    "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500";

function isToggleSuccess(data: unknown): data is FavoritesToggleResult {
    return (
        typeof data === "object" &&
        data !== null &&
        "ok" in data &&
        (data as FavoritesToggleResult).ok === true
    );
}

export function FavoriteButton({ name, lat, lon }: FavoriteButtonProps) {
    const favoriteCities = useFavorites();
    const fetcher = useFetcher();
    const revalidate = useRevalidator().revalidate;

    const favoriteRecord = findFavoriteByCityName(favoriteCities, name);
    const inFavorites = favoriteRecord !== null;

    useEffect(() => {
        if (fetcher.state === "idle" && isToggleSuccess(fetcher.data)) {
            revalidate();
        }
    }, [fetcher.state, fetcher.data, revalidate]);

    const handleToggle = () => {
        const formData = new FormData();
        if (favoriteRecord) formData.set("id", String(favoriteRecord.id));
        formData.set("name", name);
        formData.set("lat", String(lat));
        formData.set("lon", String(lon));
        formData.set("_stay", "1");
        fetcher.submit(formData, { method: "post", action: FAVORITES_TOGGLE_ACTION });
    };

    const isPending = fetcher.state !== "idle";
    const buttonClass = `${FAVORITE_BUTTON_BASE} ${inFavorites ? FAVORITE_BUTTON_ACTIVE : FAVORITE_BUTTON_INACTIVE}`;

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            className={buttonClass}
            title={inFavorites ? "Remove from favorites" : "Add to favorites"}
            aria-label={inFavorites ? "Remove from favorites" : "Add to favorites"}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={inFavorites ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>
        </button>
    );
}
