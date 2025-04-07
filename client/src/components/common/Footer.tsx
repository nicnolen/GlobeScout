import React, { JSX } from 'react';
import Image from 'next/image';

export default function Footer(): JSX.Element {
    return (
        <footer>
            <div className="flex items-center justify-center space-x-4">
                <Image
                    src="/images/GlobeScoutLogoLargeLight.webp"
                    alt="GlobeScout Logo"
                    width={64}
                    height={64}
                    className="object-contain"
                    priority
                    unoptimized
                />
                <p>© 2025 GlobeScout. All rights reserved.</p>
            </div>
        </footer>
    );
}
