import React, { JSX } from 'react';
import Link from 'next/link';

interface FeatureDescriptionProps {
    title: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
}

export default function FeatureDescription({
    title,
    description,
    buttonText,
    buttonLink,
}: FeatureDescriptionProps): JSX.Element {
    return (
        <section className="mb-8 last:mb-0">
            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
            <p className="mb-4">{description}</p>
            {buttonLink && (
                <Link href={buttonLink}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{buttonText}</button>
                </Link>
            )}
        </section>
    );
}
