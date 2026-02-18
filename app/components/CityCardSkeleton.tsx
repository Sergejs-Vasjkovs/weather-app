export function CityCardSkeleton() {
    return (
        <div className="group relative mt-6 rounded-lg w-90 border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 animate-pulse">
            <div className="flex justify-between items-start">
                <div className="rounded-lg bg-gray-200 dark:bg-gray-700 h-16 w-16" />

                <div className="flex flex-col items-end">
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                    <div className="h-3 w-20 bg-gray-100 dark:bg-gray-700 rounded" />
                </div>
            </div>

            <div className="mt-4 flex justify-between items-end">
                <div>
                    <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                    <div className="h-4 w-28 bg-gray-100 dark:bg-gray-700 rounded" />
                </div>
                <div className="flex flex-col items-end">
                    <div className="h-4 w-24 bg-gray-100 dark:bg-gray-700 rounded" />
                </div>
            </div>

            <div className="my-4 border-t border-gray-100 dark:border-gray-700" />

            <div className="grid grid-cols-3 gap-y-4 gap-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <div className="h-2 w-12 bg-gray-100 dark:bg-gray-700 rounded" />
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}
