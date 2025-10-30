import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
                        <ShieldX className="size-16 text-destructive animate-pulse"/>
                    </div>
                    <CardTitle className="text-2xl mt-4">
                        Access Restricted
                    </CardTitle>
                    <CardDescription className="mx-auto max-w-xs">
                        Hey User! It looks like you are not an admin and therefore do not have access to this page. If you believe this is a mistake, please contact support or try logging in with an admin account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="mx-auto">
                    <Link href="/login">
                        <Button className="cursor-pointer">
                            <ArrowLeft className="mr-1 size-4"/>Back to Home
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}