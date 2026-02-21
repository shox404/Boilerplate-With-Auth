"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export function useAuthGuard() {
    const router = useRouter();
    const { member, getMember } = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMember = async () => {
            try {
                await getMember();
            } finally {
                setLoading(false);
            }
        };

        if (!member) {
            fetchMember();
        } else {
            setLoading(false);
        }
    }, [member, getMember]);

    useEffect(() => {
        if (!loading && member === null) {
            router.replace("/auth");
        }
    }, [loading, member, router]);

    return { loading, member };
}
