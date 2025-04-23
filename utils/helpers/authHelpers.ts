interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'none';
    maxAge: number;
    domain: string;
}
export function cookieOptions(maxAge: number): CookieOptions {
    const domain =
        process.env.NODE_ENV === 'development'
            ? 'localhost' // Use the Vercel domain for production
            : 'globe-scout.vercel.app'; // Use localhost for development

    return {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: maxAge,
        domain: domain,
    };
}
