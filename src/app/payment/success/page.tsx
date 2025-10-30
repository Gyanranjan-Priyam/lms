"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { ArrowLeft, CheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PaymentSuccess() {

   const {triggerConfetti} = useConfetti();
   useEffect(() => {
      triggerConfetti();
   }, [triggerConfetti])

   return (
      <div className="w-full min-h-screen flex flex-1 justify-center items-center">
         <Card className="w-[350px]">
            <CardContent>
               <div className="w-full flex justify-center">
                  <CheckIcon className="size-12 p-2 bg-green-500/20 rounded-full text-green-500"/>
               </div>
               <div className="mt-2 text-center sm:mt-5 w-full">
                  <h2 className="text-2xl font-semibold">Payment Successful</h2>
                  <p className="text-sm mt-2 text-muted-foreground text-balance">Your payment has been processed successfully. If you have any questions, please contact support.</p>
                  <Link href="/dashboard" className={buttonVariants({ className: "mt-5 w-full" })}>
                     <ArrowLeft className="mr-2 size-4"/>
                     Go back to Dashboard.
                  </Link>
               </div>
            </CardContent>
         </Card>
      </div>
   )
}