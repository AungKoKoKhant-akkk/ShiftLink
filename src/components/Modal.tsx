import type { ReactNode } from "react";

type ModalProps = {
    children: ReactNode;
    className?: string;
};

export default function Modal({ children, className = "" }: ModalProps) {
    return (
        <div className="modal modal-open">
            <div className={`modal-box${className ? ` ${className}` : ""}`}>{children}</div>
        </div>
    );
}
