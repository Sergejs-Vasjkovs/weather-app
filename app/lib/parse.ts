export function parsePage(
    request: Request,
    options: { defaultPage?: number; maxPage: number },
): number {
    const { defaultPage = 1, maxPage } = options;
    const url = new URL(request.url);
    const param = url.searchParams.get("page");
    const parsed = parseInt(param ?? String(defaultPage), 10);
    const page = Number.isFinite(parsed) && parsed >= 1 ? parsed : defaultPage;
    return Math.min(maxPage, Math.max(1, page));
}

export type ToggleFormData = {
    stayOnPage: boolean;
    id: number | null;
    name: string;
    lat: number | null;
    lon: number | null;
};

export function parseToggleFormData(formData: FormData): ToggleFormData {
    const stayOnPage = formData.get("_stay") === "1";
    const idRaw = formData.get("id")?.toString();
    const id = idRaw && idRaw !== "" && Number.isFinite(Number(idRaw)) ? Number(idRaw) : null;
    const name = formData.get("name")?.toString()?.trim() ?? "";
    const latRaw = formData.get("lat")?.toString();
    const lonRaw = formData.get("lon")?.toString();
    const lat =
        latRaw != null && latRaw !== "" && Number.isFinite(Number(latRaw)) ? Number(latRaw) : null;
    const lon =
        lonRaw != null && lonRaw !== "" && Number.isFinite(Number(lonRaw)) ? Number(lonRaw) : null;
    return { stayOnPage, id, name, lat, lon };
}
