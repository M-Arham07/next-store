"use client"
import { ChromeIcon, GithubIcon } from "lucide-react";
import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button";

export function GoogleLoginButton({redirectUrl = "/products"}) {
    return (
        <Button variant="outline" className="w-full bg-transparent" onClick={() => signIn('google',{callbackUrl:redirectUrl})}>
            <ChromeIcon className="mr-2 h-4 w-4" />
            Sign in with Google
        </Button>

    );
}

export function GitHubLoginButton() {
    return (
        <Button variant="outline" className="w-full bg-transparent" onClick={() => signIn('github',{callbackUrl:redirectUrl})}>
            <GithubIcon className="mr-2 h-4 w-4" />
            Sign in with GitHub
        </Button>
    )
}