"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Mail, Check, LoaderIcon } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function AuthPage() {
    const {
        account,
        step,
        email,
        code,
        isLoading,
        setEmail,
        setCode,
        setStep,
        requestCode,
        verifyCode,
    } = useAuthStore();

    const router = useRouter();
    const lastRequestedEmail = useRef<string | null>(null);

    useEffect(() => {
        if (account) router.replace("/");
    }, [account, router]);

    const sendCodeIfNeeded = async () => {
        if (email === lastRequestedEmail.current) {
            setStep(2);
            return;
        }

        await requestCode();
        lastRequestedEmail.current = email;
        setStep(2);
        toast.success("Code sent! Check your email.");
    };

    const handleRequestCode = async () => {
        try {
            await sendCodeIfNeeded();
        } catch {
            toast.error("Failed to send code");
        }
    };

    const handleVerifyCode = async () => {
        try {
            await verifyCode();
            toast.success("Logged in successfully!");
            router.push("/");
        } catch {
            toast.error("Invalid code");
        }
    };

    const handleResendCode = async () => {
        try {
            await requestCode();
            toast.success("New code sent!");
        } catch {
            toast.error("Failed to resend code");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-dvh px-4">
            <div className="w-full max-w-md p-6 border rounded-2xl shadow-sm">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">
                        {step === 1 ? "Login with Email" : "Enter the Code"}
                    </h1>
                    <p className="mt-1 text-sm">
                        {step === 1
                            ? "We'll send a 5-digit code to your email ✨"
                            : `Code sent to ${email}`}
                    </p>
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <InputGroup className="border rounded-lg overflow-hidden">
                            <InputGroupAddon>
                                <Mail className="w-5 h-5" />
                            </InputGroupAddon>
                            <InputGroupInput
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </InputGroup>

                        <Button
                            className="w-full flex gap-2"
                            onClick={handleRequestCode}
                            disabled={isLoading || !email}
                        >
                            {isLoading ? (
                                <>
                                    <LoaderIcon className="animate-spin w-5 h-5" />
                                    Sending
                                </>
                            ) : (
                                <>
                                    Send Code
                                    <Check className="w-5 h-5" />
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col items-center gap-3">
                        <InputOTP
                            maxLength={5}
                            value={code}
                            onChange={setCode}
                        >
                            <InputOTPGroup>
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <InputOTPSlot
                                        key={i}
                                        index={i}
                                        className="h-12 w-12 text-lg"
                                    />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>

                        <Button
                            className="w-40"
                            onClick={handleVerifyCode}
                            disabled={isLoading || code.length !== 5}
                        >
                            {isLoading ? "Verifying..." : "Login"}
                        </Button>

                        <Button
                            variant="link"
                            onClick={handleResendCode}
                            disabled={isLoading}
                            className="text-sm"
                        >
                            Resend code
                        </Button>

                        <Button
                            variant="link"
                            className="text-sm"
                            onClick={() => setStep(1)}
                        >
                            Change email
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
