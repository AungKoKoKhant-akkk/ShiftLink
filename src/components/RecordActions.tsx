"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

type RecordActionsProps = {
    label: string;
    onEdit: () => void;
    onDelete: () => void;
};

export default function RecordActions({ label, onEdit, onDelete }: RecordActionsProps) {
    const { t } = useLanguage();
    return (
        <>
            <button type="button" className="btn btn-ghost btn-sm" aria-label={`${t("edit")} ${label}`} onClick={onEdit}>
                <Pencil size={17} />
            </button>
            <button type="button" className="btn btn-ghost btn-sm text-error" aria-label={`${t("delete")} ${label}`} onClick={onDelete}>
                <Trash2 size={17} />
            </button>
        </>
    );
}
