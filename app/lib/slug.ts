export function toCitySlug(name: string): string {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-zа-яё0-9-]/gi, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export function slugToDisplayName(slug: string): string {
    return slug
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");
}

export function getCityDetailPath(name: string, lat: number, lon: number): string {
    return `/city/${toCitySlug(name)}?lat=${lat}&lon=${lon}`;
}
