import { Link, useLoaderData } from "react-router";
import { getCityDetailPath } from "~/lib/slug";
import { getGeocodingSearch, type GeocodingResult } from "~/lib/weather.server";
import type { Route } from "./+types/search";
import { BackHomeButton } from "~/ui/BackHomeButton";

export function meta({ data }: Route.MetaArgs) {
    const query = data?.query ?? "";
    const title = query ? `Search weather in your city: ${query}` : "Search weather in your city";
    return [{ title }];
}

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.trim() ?? "";

    if (!q) {
        return { geoResults: [], query: "" };
    }

    const geoResults = await getGeocodingSearch(q).catch(() => [] as GeocodingResult[]);
    return { geoResults, query: q };
}

export default function Search() {
    const { geoResults, query } = useLoaderData<typeof loader>();
    return (
        <div className="mx-auto max-w-2xl px-4 py-6">
            <BackHomeButton />

            {geoResults.length === 0 ? (
                <p className="mt-4 text-gray-500 dark:text-gray-400 p-4 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    {query
                        ? `No matches found for the city: «${query}».`
                        : "Enter the name of the city in the search field above."}
                </p>
            ) : (
                <section className="mt-6 space-y-8">
                    <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white text-center">
                        Cities around the world
                    </h2>

                    <ul className="list-none space-y-2 p-0">
                        {geoResults.map((item: GeocodingResult, i: number) => {
                            const label =
                                item.state && item.country
                                    ? `${item.name}, ${item.state}, ${item.country}`
                                    : item.country
                                      ? `${item.name}, ${item.country}`
                                      : item.name;
                            const cityUrl = getCityDetailPath(item.name, item.lat, item.lon);
                            return (
                                <li
                                    key={`${item.lat}-${item.lon}-${i}`}
                                    className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                                    <Link
                                        to={cityUrl}
                                        className="min-w-0 flex-1 font-medium text-gray-900 hover:underline dark:text-white">
                                        {label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}
        </div>
    );
}
