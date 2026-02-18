import { GEO_SEARCH_LIMIT, OPENWEATHER_BASE_URL, OPENWEATHER_GEO_URL } from "~/constants";

function getApiKey(): string {
    const key = process.env.OPENWEATHER_API_KEY;
    if (!key) {
        throw new Error("OPENWEATHER_API_KEY environment variable is not set");
    }
    return key;
}

async function fetchOpenWeatherJson<T>(url: string, errorLabel: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`${errorLabel} (${res.status}): ${text}`);
    }
    return res.json() as Promise<T>;
}

export async function getCurrentWeatherByCityName(cityName: string) {
    const apiKey = getApiKey();
    const params = new URLSearchParams({
        q: cityName,
        appid: apiKey,
        units: "metric",
        lang: "en",
    });
    return fetchOpenWeatherJson<OpenWeatherCurrentResponse>(
        `${OPENWEATHER_BASE_URL}/weather?${params}`,
        "OpenWeather API error",
    );
}

export async function getCurrentWeatherByCoords(lat: number, lon: number) {
    const apiKey = getApiKey();
    const params = new URLSearchParams({
        lat: String(lat),
        lon: String(lon),
        appid: apiKey,
        units: "metric",
        lang: "en",
    });
    return fetchOpenWeatherJson<OpenWeatherCurrentResponse>(
        `${OPENWEATHER_BASE_URL}/weather?${params}`,
        "OpenWeather API error",
    );
}

export type GeocodingResult = {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
};

export async function getGeocodingSearch(
    query: string,
    limit = GEO_SEARCH_LIMIT,
): Promise<GeocodingResult[]> {
    const apiKey = getApiKey();
    const params = new URLSearchParams({
        q: query.trim(),
        limit: String(limit),
        appid: apiKey,
    });
    const data = await fetchOpenWeatherJson<
        Array<{
            name: string;
            lat: number;
            lon: number;
            country: string;
            state?: string;
        }>
    >(`${OPENWEATHER_GEO_URL}/direct?${params}`, "OpenWeather Geocoding API error");
    return data.map(({ name, lat, lon, country, state }) => ({ name, lat, lon, country, state }));
}

export type OpenWeatherCurrentResponse = {
    name: string;
    id: number;
    clouds: { all: number };
    main: { temp: number; feels_like: number; humidity: number; pressure: number };
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    sys: { country: string };
    wind: { speed: number };
    coord: { lat: number; lon: number };
    visibility: number;
};

export async function getFiveDayForecast(lat: number, lon: number) {
    const apiKey = getApiKey();
    const params = new URLSearchParams({
        lat: String(lat),
        lon: String(lon),
        appid: apiKey,
        units: "metric",
        lang: "en",
    });
    return fetchOpenWeatherJson<OpenWeatherForecast5Response>(
        `${OPENWEATHER_BASE_URL}/forecast?${params}`,
        "OpenWeather Forecast API error",
    );
}

export type OpenWeatherForecast5Response = {
    list: Array<{
        dt: number;
        main: {
            temp: number;
            feels_like: number;
            temp_min: number;
            temp_max: number;
            humidity: number;
        };
        weather: Array<{ id: number; main: string; description: string; icon: string }>;
    }>;
};

export type CityForecast = {
    current: {
        dt: number;
        temp: number;
        feels_like: number;
        humidity: number;
        weather: Array<{ id: number; main: string; description: string; icon: string }>;
    };
    daily: Array<{
        dt: number;
        temp: { min: number; max: number };
        weather: Array<{ id: number; main: string; description: string; icon: string }>;
    }>;
};

export function normalizeFiveDayToCityForecast(data: OpenWeatherForecast5Response): CityForecast {
    const list = data.list;
    if (!list.length) {
        return {
            current: {
                dt: 0,
                temp: 0,
                feels_like: 0,
                humidity: 0,
                weather: [],
            },
            daily: [],
        };
    }
    const current = list[0];
    const byDay = new Map<
        string,
        { dt: number; min: number; max: number; weather: (typeof list)[0]["weather"] }
    >();
    for (const item of list) {
        const dayKey = new Date(item.dt * 1000).toISOString().slice(0, 10);
        const existing = byDay.get(dayKey);
        if (!existing) {
            byDay.set(dayKey, {
                dt: item.dt,
                min: item.main.temp_min,
                max: item.main.temp_max,
                weather: item.weather,
            });
        } else {
            existing.min = Math.min(existing.min, item.main.temp_min);
            existing.max = Math.max(existing.max, item.main.temp_max);
        }
    }
    const daily = Array.from(byDay.values())
        .sort((a, b) => a.dt - b.dt)
        .slice(0, 5)
        .map((d) => ({
            dt: d.dt,
            temp: { min: d.min, max: d.max },
            weather: d.weather,
        }));
    return {
        current: {
            dt: current.dt,
            temp: current.main.temp,
            feels_like: current.main.feels_like,
            humidity: current.main.humidity,
            weather: current.weather,
        },
        daily,
    };
}
