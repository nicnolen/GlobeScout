import React, { JSX, ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footerButtons: ReactNode;
    message?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closeOnOutsideClick?: boolean;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footerButtons,
    message,
    size = 'md',
    closeOnOutsideClick = true,
}: ModalProps): JSX.Element | null {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle ESC key press to close modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);

        // Prevent scrolling on body when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={handleOutsideClick}
            aria-modal="true"
            role="dialog"
        >
            <div
                ref={modalRef}
                className={`${sizeClasses[size]} w-full bg-white rounded-lg shadow-xl overflow-hidden transform transition-all`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <button type="button" onClick={onClose} className="button">
                        <i className="fas fa-x" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">{children}</div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t flex justify-end items-center">
                    {message && <span className="text-sm text-gray-600 mr-3">{message}</span>}
                    <div className="flex space-x-3">{footerButtons}</div>
                </div>
            </div>
        </div>
    );
}
