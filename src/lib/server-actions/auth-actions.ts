"use server";
import { signIn, signOut } from "../auth";

export async function handleSignIn(provider: string | undefined) {
    await signIn(provider);
}

export async function handleSignOut() {
    await signOut();
}
