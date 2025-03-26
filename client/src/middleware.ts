import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isPublicPath = pathname === '/login' || pathname === '/forgot' || pathname === '/reset-password';

    const accessToken = request.cookies.get('accessToken')?.value || '';
    const refreshToken = request.cookies.get('refreshToken')?.value || '';

    const token = refreshToken && accessToken;

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login page
         * - forgot page
         * - reset-password page
         */
        '/((?!api|_next/static|_next/image|favicon.ico|login|forgot|reset-password).*)',
    ],
};
