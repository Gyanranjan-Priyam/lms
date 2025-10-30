"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignout() {
    const router = useRouter();
    const handleSignOut = async function signOut() {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
            router.push("/login"); // redirect to login page
            toast.success("Successfully signed out!");
          },
          onError: () => {
            toast.error("Error signing out. Please try again.");
          }
        },
      });
    };

    return handleSignOut;
}