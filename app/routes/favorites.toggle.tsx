import { redirect } from "react-router";
import { prisma } from "~/db.server";
import { parseToggleFormData } from "~/lib/parse";
import type { Route } from "./+types/favorites.toggle";

export async function loader() {
    return redirect("/");
}

export async function action({ request }: Route.ActionArgs) {
    if (request.method !== "POST") return redirect("/");

    const formData = await request.formData();
    const { stayOnPage, id, name, lat, lon } = parseToggleFormData(formData);

    const existing =
        id != null
            ? await prisma.favoriteCity.findUnique({ where: { id } })
            : name
              ? await prisma.favoriteCity.findUnique({ where: { name } })
              : null;

    if (existing) {
        await prisma.favoriteCity.delete({ where: { id: existing.id } });
        return stayOnPage ? { ok: true, state: "removed" as const } : redirect("/");
    }

    if (!name) {
        return stayOnPage ? { ok: false, error: "name" } : redirect("/?error=name");
    }

    try {
        await prisma.favoriteCity.create({
            data: { name, lat, lon },
        });
    } catch (err: unknown) {
        const isUniqueViolation =
            err &&
            typeof err === "object" &&
            "code" in err &&
            (err as { code: string }).code === "P2002";
        if (isUniqueViolation) {
            return stayOnPage
                ? { ok: true, state: "added" as const }
                : redirect("/?added=duplicate");
        }
        throw err;
    }

    return stayOnPage ? { ok: true, state: "added" as const } : redirect("/");
}

export default function FavoritesToggleRoute() {
    return null;
}
