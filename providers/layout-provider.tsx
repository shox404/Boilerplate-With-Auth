"use client";

import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import ProtectedRoute from "./protect-route";

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" disableTransitionOnChange>
            <ProtectedRoute>{children}</ProtectedRoute>
            <Toaster />
            <Analytics debug={false} />
        </ThemeProvider>
    );
}