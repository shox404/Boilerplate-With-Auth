import type { User } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

export const authApi = axios.create({
    baseURL: "/api/auth"
})

type AuthState = {
    account: User | null;
    member: User | null;
    sentEmail: string;
    step: 1 | 2;
    email: string;
    code: string;
    isLoading: boolean;
    error: string | null;

    setEmail: (email: string) => void;
    setCode: (code: string) => void;
    setStep: (step: 1 | 2) => void;

    getMember: () => Promise<void>;
    checkAuth: () => Promise<void>;
    requestCode: () => Promise<void>;
    verifyCode: () => Promise<void>;
    logout: () => Promise<void>;

    updateMember: (data: Partial<Omit<User, "$id" | "$createdAt">>) => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            account: null,
            member: null,
            sentEmail: "",
            step: 1,
            email: "",
            code: "",
            isLoading: false,
            error: null,

            setEmail: (email) => set({ email }),
            setCode: (code) => set({ code }),
            setStep: (step) => set({ step }),

            getMember: async () => {
                set({ isLoading: true, error: null });
                try {
                    const { data } = await authApi.get<User>("/member", { withCredentials: true });
                    set({ member: data });
                } catch (err: any) {
                    if (err.response?.status === 401) set({ member: null });
                    else set({ error: "Auth check failed" });
                } finally {
                    set({ isLoading: false });
                }
            },

            checkAuth: async () => {
                set({ isLoading: true, error: null });
                try {
                    const { data } = await authApi.get<User>("/account", { withCredentials: true });
                    set({ account: data });
                } catch (err: any) {
                    if (err.response?.status === 401) set({ account: null });
                    else set({ error: "Auth check failed" });
                } finally {
                    set({ isLoading: false });
                }
            },

            requestCode: async () => {
                const email = get().email;
                if (!email) return;
                set({ isLoading: true, error: null });
                try {
                    await authApi.post("/request-code", { email }, { withCredentials: true });
                    set({ sentEmail: email, step: 2 });
                } catch {
                    set({ error: "Failed to send code" });
                    throw new Error("Failed to send code");
                } finally {
                    set({ isLoading: false });
                }
            },

            verifyCode: async () => {
                const { email, code } = get();
                if (!email || !code) return;
                set({ isLoading: true, error: null });
                try {
                    const { data } = await authApi.post("/verify-code", { email, code }, { withCredentials: true });
                    set({ account: data.member });
                } catch {
                    set({ error: "Invalid code" });
                    throw new Error("Invalid code");
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                set({ isLoading: true });
                await authApi.post("/logout", {}, { withCredentials: true });
                set({ account: null, sentEmail: "", step: 1, email: "", code: "", isLoading: false });
            },

            updateMember: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const { data: updated } = await authApi.put<User>("/member", data, { withCredentials: true });
                    set({ member: updated });
                } catch (err: any) {
                    set({ error: "Failed to update member" });
                    throw new Error("Failed to update member");
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        { name: "auth-storage", partialize: (state) => ({ account: state.account }) }
    )
);
