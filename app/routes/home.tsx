import { useLoaderData } from "react-router";
import { CityCard } from "~/components/CityCard";
import { CityCardSkeleton } from "~/components/CityCardSkeleton";
import { PAGE_SIZE } from "~/constants";
import { prisma } from "~/db.server";
import { parsePage } from "~/lib/parse";
import { getCurrentWeatherByCityName, type OpenWeatherCurrentResponse } from "~/lib/weather.server";
import type { Route } from "./+types/home";
import { Pagination } from "~/ui/Pagination";

export function meta(_args: Route.MetaArgs) {
    return [
        { title: "Weather App for all cities" },
        { name: "description", content: "Weather App for all cities" },
    ];
}

export async function loader({ request }: Route.LoaderArgs) {
    const total = await prisma.favoriteCity.count();
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = parsePage(request, { defaultPage: 1, maxPage: totalPages });

    const cities = await prisma.favoriteCity.findMany({
        orderBy: { createdAt: "asc" },
        skip: (safePage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
    });

    const weatherResults = await Promise.all(
        cities.map(async (city) => {
            try {
                const data = await getCurrentWeatherByCityName(city.name);
                return { cityId: city.id, weather: data as OpenWeatherCurrentResponse | null };
            } catch {
                return { cityId: city.id, weather: null };
            }
        }),
    );

    const weatherByCityId: Record<number, OpenWeatherCurrentResponse | null> = {};
    for (const { cityId, weather } of weatherResults) {
        weatherByCityId[cityId] = weather;
    }

    return { cities, weatherByCityId, total, page: safePage, pageSize: PAGE_SIZE };
}

export default function Home() {
    const { cities, weatherByCityId, total, page, pageSize } = useLoaderData<typeof loader>();

    return (
        <>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                {total === 0 ? "Add favorite city to see weather!" : "Your favorite cities"}
            </h2>

            <ul className="list-none p-0 flex flex-wrap gap-8 justify-center">
                {cities.map((city) => {
                    const weather = weatherByCityId[city.id];
                    return weather ? (
                        <li key={city.id} className="w-90 list-none">
                            <CityCard city={city} weather={weather} />
                        </li>
                    ) : (
                        <CityCardSkeleton key={city.id} />
                    );
                })}
            </ul>
            {total > pageSize && (
                <Pagination total={total} currentPage={page} pageSize={pageSize} />
            )}
        </>
    );
}
