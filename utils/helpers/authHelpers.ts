interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict';
    maxAge: number;
}
export function cookieOptions(maxAge: number): CookieOptions {
    return {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: maxAge,
    };
}
