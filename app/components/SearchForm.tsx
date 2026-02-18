export function SearchForm() {
    return (
        <>
            <form action="/search" method="get" className="flex w-full gap-x-3">
                <input
                    id="search"
                    name="q"
                    type="search"
                    placeholder="Find weather in your city"
                    aria-label="Find weather in your city"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500">
                    Search
                </button>
            </form>
        </>
    );
}
