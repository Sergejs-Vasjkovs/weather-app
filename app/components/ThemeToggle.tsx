import { useEffect, useState } from "react";
import { THEME_KEY } from "~/constants";

function getTheme(): "light" | "dark" {
    if (typeof document === "undefined") return "light";
    const stored = localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme: "light" | "dark") {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(getTheme() === "dark");
        const handler = () => setIsDark(getTheme() === "dark");
        window.addEventListener("themechange", handler);
        return () => window.removeEventListener("themechange", handler);
    }, []);

    const handleToggle = () => {
        const next = isDark ? "light" : "dark";
        setTheme(next);
        setIsDark(next === "dark");
    };

    return (
        <div className="flex flex-1 items-center justify-end gap-x-6">
            <div className="group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out has-checked:bg-indigo-600 has-focus-visible:outline-2 dark:bg-white/5 dark:inset-ring-white/10 dark:outline-indigo-500 dark:has-checked:bg-indigo-500">
                <span className="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5" />
                <input
                    id="theme-toggle"
                    name="theme-toggle"
                    type="checkbox"
                    checked={isDark}
                    onChange={handleToggle}
                    aria-labelledby="theme-toggle-label"
                    className="absolute inset-0 size-full appearance-none focus:outline-hidden cursor-pointer"
                />
            </div>

            <div className="text-sm">
                <label
                    id="theme-toggle-label"
                    className="font-medium text-gray-900 dark:text-white">
                    {isDark ? "☀️" : "🌙"}
                </label>
            </div>
        </div>
    );
}
