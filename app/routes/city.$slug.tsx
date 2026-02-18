import { useLoaderData } from "react-router";
import { slugToDisplayName } from "~/lib/slug";
import { getFiveDayForecast, normalizeFiveDayToCityForecast } from "~/lib/weather.server";
import type { Route } from "./+types/city.$slug";
import { BackHomeButton } from "~/ui/BackHomeButton";
import { CurrentWeather } from "~/ui/CurrentWeather";
import { FavoriteButton } from "~/ui/FavoriteButton";
import { ForecastTable } from "~/ui/ForecastTable";

export function meta({ data }: Route.MetaArgs) {
    if (!data?.city) return [{ title: "City not found" }];
    return [
        { title: `Weather in ${data.city.name}` },
        {
            name: "description",
            content: `Weather forecast in ${data.city.name} for the next 5 days`,
        },
    ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
    const slug = params.slug?.toLowerCase().trim();
    if (!slug) {
        throw new Response("Not Found", { status: 404 });
    }

    const url = new URL(request.url);
    const latParam = url.searchParams.get("lat");
    const lonParam = url.searchParams.get("lon");
    const lat = latParam != null ? Number(latParam) : NaN;
    const lon = lonParam != null ? Number(lonParam) : NaN;

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        throw new Response("Not Found", { status: 404 });
    }

    try {
        const data = await getFiveDayForecast(lat, lon);
        const forecast = normalizeFiveDayToCityForecast(data);
        const city = {
            name: slugToDisplayName(slug),
            lat,
            lon,
        };
        return { city, forecast };
    } catch {
        throw new Response("Not Found", { status: 404 });
    }
}

export default function CityDetail() {
    const { city, forecast } = useLoaderData<typeof loader>();

    return (
        <div className="mx-auto max-w-2xl px-4 py-6">
            <div className="flex justify-between items-center">
                <BackHomeButton />
                <FavoriteButton name={city.name} lat={city.lat} lon={city.lon} />
            </div>
            {!forecast ? (
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                    Unable to load forecast. Please check your connection and try again later.
                </p>
            ) : (
                <>
                    <CurrentWeather name={city.name} forecast={forecast} />
                    {forecast.daily.length > 0 && (
                        <section className="mt-6">
                            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                                Daily forecast
                            </h2>
                            <div className="overflow-x-auto">
                                <ForecastTable forecast={forecast} />
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}
