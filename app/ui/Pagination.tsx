import { Link } from "react-router";
import { PAGINATION_ELLIPSIS_THRESHOLD } from "~/constants";

type PaginationProps = {
    total: number;
    currentPage: number;
    pageSize: number;
};

function buildPageUrl(page: number): string {
    return page <= 1 ? "/" : `/?page=${page}`;
}

const baseLinkClass =
    "inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-200";
const currentLinkClass =
    "inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600 dark:border-indigo-400 dark:text-indigo-400";

export function Pagination({ total, currentPage, pageSize }: PaginationProps) {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;

    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= PAGINATION_ELLIPSIS_THRESHOLD) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push("ellipsis");
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== totalPages) pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push("ellipsis");
        if (totalPages > 1) pages.push(totalPages);
    }

    return (
        <nav
            className="flex items-center justify-center border-t border-gray-200 px-4 sm:px-0 dark:border-white/10 mt-16"
            aria-label="Pagination">
            <div className="hidden md:-mt-px md:flex md:items-center">
                {currentPage > 1 && (
                    <Link
                        to={buildPageUrl(currentPage - 1)}
                        className={baseLinkClass}
                        aria-label="Previous page">
                        ← Prev
                    </Link>
                )}
                {pages.map((p, i) =>
                    p === "ellipsis" ? (
                        <span
                            key={`ellipsis-${i}`}
                            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                            …
                        </span>
                    ) : (
                        <Link
                            key={p}
                            to={buildPageUrl(p)}
                            aria-current={p === currentPage ? "page" : undefined}
                            className={p === currentPage ? currentLinkClass : baseLinkClass}>
                            {p}
                        </Link>
                    ),
                )}
                {currentPage < totalPages && (
                    <Link
                        to={buildPageUrl(currentPage + 1)}
                        className={baseLinkClass}
                        aria-label="Next page">
                        Next →
                    </Link>
                )}
            </div>
        </nav>
    );
}
