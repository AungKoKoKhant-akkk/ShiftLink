import { Pencil, Trash2 } from "lucide-react";

type RecordActionsProps = {
    label: string;
    onEdit: () => void;
    onDelete: () => void;
};

export default function RecordActions({ label, onEdit, onDelete }: RecordActionsProps) {
    return (
        <>
            <button type="button" className="btn btn-ghost btn-sm" aria-label={`Edit ${label}`} onClick={onEdit}>
                <Pencil size={17} />
            </button>
            <button type="button" className="btn btn-ghost btn-sm text-error" aria-label={`Delete ${label}`} onClick={onDelete}>
                <Trash2 size={17} />
            </button>
        </>
    );
}
