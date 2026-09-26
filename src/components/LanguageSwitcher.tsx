"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

type LanguageSwitcherProps = {
    variant?: "light" | "dark";
    size?: "xs" | "sm";
};

export default function LanguageSwitcher({ variant = "light", size = "xs" }: LanguageSwitcherProps) {
    const { language, setLanguage } = useLanguage();
    const inactiveClass = variant === "dark"
        ? "border-white/50 bg-transparent text-white hover:border-white hover:bg-white/10"
        : "border-base-300 bg-base-100 text-base-content hover:bg-base-200";
    const activeClass = "border-primary bg-primary text-primary-content hover:bg-primary";

    return (
        <div className="join shrink-0 rounded-lg shadow-sm" aria-label="Language selector">
            <button
                type="button"
                className={`btn join-item ${size === "sm" ? "btn-sm min-w-16" : "btn-xs"} ${language === "en" ? activeClass : inactiveClass}`}
                aria-pressed={language === "en"}
                onClick={() => setLanguage("en")}
            >
                EN
            </button>
            <button
                type="button"
                className={`btn join-item ${size === "sm" ? "btn-sm min-w-16" : "btn-xs"} ${language === "ja" ? activeClass : inactiveClass}`}
                aria-pressed={language === "ja"}
                onClick={() => setLanguage("ja")}
            >
                日本語
            </button>
        </div>
    );
}
