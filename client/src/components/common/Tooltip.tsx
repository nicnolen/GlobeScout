import React, { JSX } from 'react';

interface TooltipProps {
    message: string;
    children: React.ReactNode;
    showTooltip?: boolean;
}

export default function Tooltip({ message, children, showTooltip = true }: TooltipProps): JSX.Element {
    return (
        <div className="relative group inline-block">
            {children}

            {showTooltip && (
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max rounded bg-gray-800 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {message}
                </span>
            )}
        </div>
    );
}
