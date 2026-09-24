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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
                <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>

                <p className="mt-2 text-base-content/70">
                    {description}
                </p>
            </div>

            {action}
        </div>
    );
}
