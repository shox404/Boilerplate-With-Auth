"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const hasChecked = useRef(false);

    useEffect(() => {
        if (!hasChecked.current) {
            hasChecked.current = true;
            useAuthStore.getState().checkAuth();
        }
    }, []);

    return children;
}
