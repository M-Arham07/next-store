
import { ChromeIcon, GithubIcon } from "lucide-react";
import { signIn, useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";

export function GoogleLoginButton() {
    return (
        <Button variant="outline" className="w-full bg-transparent" onClick={() => signIn('google',{callbackUrl:"/products"})}>
            <ChromeIcon className="mr-2 h-4 w-4" />
            Sign in with Google
        </Button>

    );
}

export function GitHubLoginButton() {
    return (
        <Button variant="outline" className="w-full bg-transparent" onClick={() => signIn('github',{callbackUrl:"/products"})}>
            <GithubIcon className="mr-2 h-4 w-4" />
            Sign in with GitHub
        </Button>
    )
}