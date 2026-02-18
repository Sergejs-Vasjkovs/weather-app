import { Link } from "react-router";
import type { FavoriteCity } from "~/types";
import { getCityDetailPath } from "~/lib/slug";
import type { OpenWeatherCurrentResponse } from "~/lib/weather.server";
import {
    CloudIcon,
    VariableIcon,
    EyeIcon,
    ArrowTrendingUpIcon,
    SunIcon,
} from "@heroicons/react/24/outline";

type CityCardProps = {
    city: FavoriteCity;
    weather: OpenWeatherCurrentResponse | null;
};

function getCityCardPath(city: FavoriteCity, weather: OpenWeatherCurrentResponse | null): string {
    const lat = weather?.coord?.lat ?? city.lat;
    const lon = weather?.coord?.lon ?? city.lon;
    if (lat == null || lon == null) return "/";
    return getCityDetailPath(city.name, lat, lon);
}

export function CityCard({ city, weather }: CityCardProps) {
    return (
        <Link to={getCityCardPath(city, weather)}>
            {weather ? (
                <div className="group relative mt-6 rounded-lg w-90 border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 transition-hover hover:bg-gray-100 dark:hover:bg-gray-900">
                    <div className="flex justify-between items-start">
                        <div className="rounded-lg p-1">
                            <img
                                src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
                                alt={weather?.weather[0].description}
                                className="w-16 h-16 object-contain"
                            />
                        </div>

                        <div className="text-right">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white uppercase tracking-wider">
                                {weather?.name}, {weather?.sys?.country}
                            </h3>
                            <p className="mt-1 text-xs text-gray-700 dark:text-white">
                                Current weather
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between items-end">
                        <div>
                            <p className="text-4xl font-bold text-gray-900 dark:text-white">
                                {Math.round(weather?.main.temp)}°C
                            </p>
                            <p className="text-sm text-gray-400 dark:text-white mt-1 capitalize">
                                {weather?.weather[0].description}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-400 dark:text-white">
                                Feels like: {Math.round(weather?.main.feels_like)}°
                            </p>
                        </div>
                    </div>

                    <div className="my-4 border-t border-gray-100" />

                    <div className="grid grid-cols-3 gap-y-4 gap-x-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                <VariableIcon className="h-3 w-3" /> Wind
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                                {weather?.wind?.speed} m/s
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                <CloudIcon className="h-3 w-3" /> Humidity
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                                {weather?.main.humidity}%
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                <EyeIcon className="h-3 w-3" /> Visibility
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                                {weather?.visibility / 100} м
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                <ArrowTrendingUpIcon className="h-3 w-3" /> Pressure
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                                {weather?.main.pressure} hPa
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                <SunIcon className="h-3 w-3" /> Clouds
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                                {weather?.clouds?.all}%
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="mt-2 text-gray-500 dark:text-gray-400">No weather data</p>
            )}
        </Link>
    );
}
