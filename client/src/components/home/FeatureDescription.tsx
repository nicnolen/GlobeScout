import React, { JSX } from 'react';
import Link from 'next/link';
import { FeatureDescriptionProps } from '../../../../types/featureDescription';

export default function FeatureDescription({
    title,
    description,
    buttonText,
    buttonLink,
}: FeatureDescriptionProps): JSX.Element {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
            <p className="mb-4">{description}</p>
            <Link href={buttonLink}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{buttonText}</button>
            </Link>
        </section>
    );
}
