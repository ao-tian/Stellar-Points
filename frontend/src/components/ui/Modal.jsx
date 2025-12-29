import { useEffect } from "react";
import { cn } from "../../lib/cn";

export default function Modal({ isOpen, onClose, title, children, className }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-3xl w-full bg-white shadow-2xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold text-neutral">{title}</h3>
                    <button
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
                <div className={cn("", className)}>{children}</div>
            </div>
            <div
                className="modal-backdrop backdrop-blur-sm bg-black/30"
                onClick={onClose}
            />
        </div>
    );
}

