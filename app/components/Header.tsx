import { Link } from "react-router";
import { ThemeToggle } from "./ThemeToggle";
import { SearchForm } from "./SearchForm";

export function Header() {
    return (
        <header className="bg-white dark:bg-gray-900">
            <nav
                aria-label="Global"
                className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
                        <img
                            src="/logo.svg"
                            alt="Mr. Storm logotype"
                            width={75}
                            height={75}
                            className="h-9 w-9 shrink-0 object-contain"
                        />
                    </Link>
                </div>
                <SearchForm />
                <ThemeToggle />
            </nav>
        </header>
    );
}
