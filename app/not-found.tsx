import Link from "next/link"

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
            <div className="text-center max-w-xl">
                <h1 className="text-6xl font-bold mb-6">404</h1>

                <h2 className="text-2xl font-semibold mb-4">
                    This page does't exist.
                </h2>

                <p className="text-gray-400 mb-8">
                    Looks like the portfolio you're looking for has moved or never existed.
                </p>

                <Link
                    href="/"
                    className="inline-block bg-white text-black px-6 py-3 rounded-xl font-medium hover:opacity-80 transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    )
}