import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isPublicPath = pathname === '/login' || pathname === '/forgot';

    const token = request.cookies.get('refreshToken')?.value || '';

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
         * - login (Login Page)
         * - forgot (Forgot Page)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|login|forgot).*)',
    ],
};
