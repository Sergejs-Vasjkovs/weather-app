import type { CityForecast } from "~/lib/weather.server";

function formatDate(ts: number) {
    return new Date(ts * 1000).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
}

export function ForecastTable({ forecast }: { forecast: CityForecast }) {
    return (
        <table className="w-full border-separate border-spacing-y-2">
            <tbody>
                {forecast.daily.map((day) => (
                    <tr
                        key={day.dt}
                        className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-sm transition-hover hover:bg-gray-100 dark:hover:bg-gray-900">
                        <td className="rounded-l-lg pl-4 py-2 w-30">
                            <img
                                src={`https://openweathermap.org/img/wn/${day?.weather[0].icon}@2x.png`}
                                alt={day?.weather[0].description}
                                className="w-16 h-16 object-contain"
                            />
                        </td>

                        <td className="px-6 py-4 text-gray-700 dark:text-gray-200 whitespace-nowrap font-medium">
                            {formatDate(day.dt)}
                        </td>

                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                            {Math.round(day.temp.min)}° — {Math.round(day.temp.max)}°
                        </td>

                        <td className="rounded-r-lg pr-4 py-4 capitalize text-gray-600 dark:text-gray-300">
                            {day.weather[0].description}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
