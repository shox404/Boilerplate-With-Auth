import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 animate-spin mb-6" />
            <p className="text-lg font-semibold tracking-wide animate-pulse">
                Loading...
            </p>
        </div>
    )
}
