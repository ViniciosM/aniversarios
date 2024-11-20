import { NextRequest, NextResponse } from "next/server";
import { baseUrlNormalized } from "./lib/utils";
import { auth } from "./lib/auth";

export default auth((req: NextRequest) => {
    const token = req.cookies.get("authjs.session-token");
    const pathname = req.nextUrl.pathname;
    const isRootPath = pathname === "/";
    const isPagesValidToReditectToApp = pathname === "/auth/login" ||
        pathname === "/auth/sign-up" || isRootPath;

    if (isPagesValidToReditectToApp && token) {
        return NextResponse.redirect(new URL(baseUrlNormalized("/app")));
    }

    const isPagesValidToReditectToLogin = pathname.includes("/app") ||
        isRootPath;
    if (isPagesValidToReditectToLogin && (!token)) {
        return NextResponse.redirect(new URL(baseUrlNormalized("/auth/login")));
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
