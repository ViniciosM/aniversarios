import { NextRequest, NextResponse } from 'next/server'
import { baseUrlNormalized } from './lib/base-url-normalized'
import { auth } from "@/lib/auth"

export default auth((req: NextRequest) => {
    const isDebug = false;
    const token = req.cookies.get('authjs.session-token')
    const pathname = req.nextUrl.pathname

    if ((pathname === '/auth/login' || pathname === '/auth/sign-up') && (token || isDebug)) {
        console.log("redirecting to app");
        return NextResponse.redirect(new URL(baseUrlNormalized('/app')))
    }

    if (pathname.includes('/app') && (!token && !isDebug)) {
        console.log("redirecting to login");
        return NextResponse.redirect(new URL(baseUrlNormalized('/auth/login')))
    }
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}