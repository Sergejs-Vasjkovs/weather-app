import type { CityForecast } from "~/lib/weather.server";

export function CurrentWeather({ name, forecast }: { name: string; forecast: CityForecast }) {
    return (
        <section className="mt-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h1>
            <p className="mt-1 text-xs text-gray-700 dark:text-white">Current weather</p>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
                {Math.round(forecast.current.temp)} °C, feels like{" "}
                {Math.round(forecast.current.feels_like)} °C
            </p>
            <p className="text-gray-600 dark:text-gray-300">
                Humidity: {forecast.current.humidity}%
            </p>
            {forecast.current.weather[0] && (
                <p className="capitalize text-gray-600 dark:text-gray-300">
                    {forecast.current.weather[0].description}
                </p>
            )}
        </section>
    );
}
