import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelled() {
   return (
      <div className="w-full min-h-screen flex flex-1 justify-center items-center">
         <Card className="w-[350px]">
            <CardContent>
               <div className="w-full flex justify-center">
                  <XIcon className="size-12 p-2 bg-red-500/20 rounded-full text-red-500"/>
               </div>
               <div className="mt-2 text-center sm:mt-5 w-full">
                  <h2 className="text-2xl font-semibold">Payment Cancelled</h2>
                  <p className="text-sm mt-2 text-muted-foreground text-balance">Your payment has been cancelled. If you have any questions, please contact support.</p>
                  <Link href="/" className={buttonVariants({ className: "mt-5 w-full" })}>
                     <ArrowLeft className="mr-2 size-4"/>
                     Go back to Home Page.
                  </Link>
               </div>
            </CardContent>
         </Card>
      </div>
   )
}