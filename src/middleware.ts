import { NextRequest, NextResponse } from 'next/server'
import { baseUrlNormalized } from './lib/base-url-normalized'
import { auth } from "@/lib/auth"

export default auth((req: NextRequest) => {
    const isDebug = true;
    const token = req.cookies.get('authjs.session-token')
    const pathname = req.nextUrl.pathname

    const isPagesValidToReditectToApp = pathname === '/auth/login' || pathname === '/auth/sign-up' || pathname === '/';

    if (isPagesValidToReditectToApp && (token || isDebug)) {

        return NextResponse.redirect(new URL(baseUrlNormalized('/app')))
    }

    const isPagesValidToReditectToLogin = (pathname.includes('/app') || pathname === "/");
    if (isPagesValidToReditectToLogin && (!token && !isDebug)) {
        return NextResponse.redirect(new URL(baseUrlNormalized('/auth/login')))
    }
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}