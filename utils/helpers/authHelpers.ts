interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'none';
    maxAge: number;
}
export function cookieOptions(maxAge: number): CookieOptions {
    return {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: maxAge,
    };
}
