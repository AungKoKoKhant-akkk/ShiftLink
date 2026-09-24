"use client";

import { useState } from "react";
import { CalendarDays, LockKeyhole, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useShiftLink } from "@/components/providers/ShiftLinkProvider";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useShiftLink();

    const [employeeCode, setEmployeeCode] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
            <section className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="mb-3 flex items-center justify-center gap-2 text-[#0b1f3a]">
                        <CalendarDays size={32} className="text-primary" />
                        <h1 className="text-3xl font-bold">ShiftLink</h1>
                    </div>

                    <p className="mb-4 text-center text-sm text-base-content/60">
                        Sign in to manage your schedule.
                    </p>

                    <form
                        className="space-y-4"
                        onSubmit={async (event) => {
                            event.preventDefault();
                            setErrorMessage("");
                            setIsSubmitting(true);

                            try {
                                await login(employeeCode.trim(), password);
                                router.replace("/");
                            } catch (error) {
                                setErrorMessage(
                                    error instanceof Error
                                        ? error.message
                                        : "Login failed. Please try again."
                                );
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                    >
                        <label className="input input-bordered flex items-center gap-2">
                            <UserRound size={18} className="text-base-content/60" />
                            <input
                                className="grow"
                                type="text"
                                placeholder="Employee code"
                                value={employeeCode}
                                onChange={(event) =>
                                    setEmployeeCode(event.target.value)
                                }
                                autoComplete="username"
                                required
                            />
                        </label>

                        <label className="input input-bordered flex items-center gap-2">
                            <LockKeyhole size={18} className="text-base-content/60" />
                            <input
                                className="grow"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                autoComplete="current-password"
                                required
                            />
                        </label>

                        {errorMessage && (
                            <div className="alert alert-error text-sm">
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <button
                            className="btn btn-primary w-full"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}