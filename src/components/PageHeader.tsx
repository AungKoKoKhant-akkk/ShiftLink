import type { ReactNode } from "react";

type PageHeaderProps = {
    title: string;
    description: string;
    action?: ReactNode;
};

export default function PageHeader({
    title,
    description,
    action,
}: PageHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold">{title}</h1>

                <p className="mt-2 text-base-content/70">
                    {description}
                </p>
            </div>

            {action}
        </div>
    );
}
