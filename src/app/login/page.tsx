"use client";

import { useState } from "react";
import { CalendarDays, LockKeyhole, UserRound } from "lucide-react";
import { useShiftLink } from "@/components/providers/ShiftLinkProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function LoginPage() {
    const { login } = useShiftLink();
    const { t } = useLanguage();

    const [employeeCode, setEmployeeCode] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4 sm:p-6">
            <section className="card w-full max-w-md overflow-hidden border border-base-300/70 bg-base-100 shadow-2xl">
                <div className="h-1.5 bg-primary" />
                <div className="card-body px-6 py-8 sm:px-10 sm:py-10">
                    <div className="flex items-center justify-center gap-3 text-[#0b1f3a]">
                        <span className="grid size-11 place-items-center rounded-xl bg-primary/10">
                            <CalendarDays size={28} className="text-primary" />
                        </span>
                        <h1 className="text-3xl font-bold tracking-tight">ShiftLink</h1>
                    </div>

                    <p className="mt-4 text-center text-sm leading-6 text-base-content/65">
                        {t("loginDescription")}
                    </p>

                    <div className="mt-4 flex justify-center">
                        <LanguageSwitcher size="sm" />
                    </div>

                    <form
                        className="mt-7 space-y-4"
                        onSubmit={async (event) => {
                            event.preventDefault();
                            setErrorMessage("");
                            setIsSubmitting(true);

                            try {
                                await login(employeeCode.trim(), password);
                                window.location.assign(new URL("/", window.location.origin));
                            } catch (error) {
                                setErrorMessage(
                                    error instanceof Error
                                        ? error.message
                                        : t("loginFailed")
                                );
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                    >
                        <label className="input input-bordered h-12 w-full gap-3 focus-within:border-primary focus-within:outline-none">
                            <UserRound size={18} className="text-base-content/60" />
                            <input
                                className="grow"
                                type="text"
                                placeholder={t("employeeCode")}
                                value={employeeCode}
                                onChange={(event) =>
                                    setEmployeeCode(event.target.value)
                                }
                                autoComplete="username"
                                required
                            />
                        </label>

                        <label className="input input-bordered h-12 w-full gap-3 focus-within:border-primary focus-within:outline-none">
                            <LockKeyhole size={18} className="text-base-content/60" />
                            <input
                                className="grow"
                                type="password"
                                placeholder={t("password")}
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
                            className="btn btn-primary mt-2 h-12 w-full text-base shadow-md"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t("signingIn") : t("signIn")}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
