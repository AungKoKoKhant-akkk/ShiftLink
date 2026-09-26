"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

type FeedbackContextValue = {
    notify: (message: string, tone?: "error" | "success") => void;
    confirm: (message: string) => Promise<boolean>;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
    const { t } = useLanguage();
    const [notice, setNotice] = useState<{ message: string; tone: "error" | "success" } | null>(null);
    const [confirmation, setConfirmation] = useState<{ message: string; resolve: (approved: boolean) => void } | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const notify = useCallback((message: string, tone: "error" | "success" = "success") => {
        setNotice({ message, tone });
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setNotice(null), 3500);
    }, []);

    const confirm = useCallback((message: string) => new Promise<boolean>((resolve) => {
        setConfirmation({ message, resolve });
    }), []);

    const value = useMemo(() => ({ notify, confirm }), [notify, confirm]);

    function closeConfirmation(approved: boolean) {
        confirmation?.resolve(approved);
        setConfirmation(null);
    }

    return (
        <FeedbackContext.Provider value={value}>
            {children}
            {notice && (
                <div className="toast toast-top toast-end z-50">
                    <div className={`alert ${notice.tone === "error" ? "alert-error" : "alert-success"}`}>
                        <span>{notice.message}</span>
                    </div>
                </div>
            )}
            {confirmation && (
                <div className="modal modal-open z-50" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
                    <div className="modal-box">
                        <h2 id="confirmation-title" className="text-xl font-bold">{t("pleaseConfirm")}</h2>
                        <p className="mt-3 text-base-content/70">{confirmation.message}</p>
                        <div className="modal-action">
                            <button type="button" className="btn" onClick={() => closeConfirmation(false)}>{t("cancel")}</button>
                            <button type="button" className="btn btn-error" onClick={() => closeConfirmation(true)}>{t("delete")}</button>
                        </div>
                    </div>
                </div>
            )}
        </FeedbackContext.Provider>
    );
}

export function useFeedback() {
    const context = useContext(FeedbackContext);
    if (!context) throw new Error("useFeedback must be used inside FeedbackProvider");
    return context;
}
