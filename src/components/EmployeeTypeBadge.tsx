"use client";

import type { EmployeeType } from "@/types/employee";
import { useLanguage } from "@/components/providers/LanguageProvider";

const typeClasses: Record<EmployeeType, string> = {
    Student: "badge-info",
    Regular: "badge-warning",
};

export default function EmployeeTypeBadge({ type }: { type: EmployeeType }) {
    const { t } = useLanguage();
    return <span className={`badge ${typeClasses[type]}`}>{t(type === "Student" ? "student" : "regular")}</span>;
}
