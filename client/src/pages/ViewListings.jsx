export function ViewListings() {
    return (
        <div className="m-3 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-700">
            <a href="#">
                <img className="p-8 rounded-t-lg" src="/docs/images/products/apple-watch.png" alt="product image" />
            </a>
            <div className="px-5 pb-5">
                <a href="#">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport
                    </h5>
                </a>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">$599</span>
                    <a
                        href="#"
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    >Delete
                    </a>
                </div>
            </div>
        </div>
    );
}




