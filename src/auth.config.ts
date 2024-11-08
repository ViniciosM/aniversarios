import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        error: '/',
        signIn: '/auth/login',
        signOut: '/',
    },
    callbacks: {
        authorized({ auth }) {
            const isDebug = true;
            const isAuthenticated = !!auth?.user || isDebug;
            return isAuthenticated;
        },
    },
    providers: [],
} satisfies NextAuthConfig;