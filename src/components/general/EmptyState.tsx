import { BanIcon, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface iAppProps {
   title: string;
   description: string;
   buttonText: string;
   href: string;
}

export function EmptyState({ title, description, buttonText, href }: iAppProps) {
   return (
      <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border border-dashed border-primary text-center animate-in p-8 fade-in-50">
         <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
            <BanIcon className="size-10 text-primary" />
         </div>
         <h2 className="mt-6 text-4xl font-semibold">{title}</h2>
         <p className="mt-4 mb-8 text-sm text-center leading-tight text-muted-foreground">{description}</p>
         <Link href={href} className={buttonVariants({ variant: "default" })}>
            <PlusCircleIcon className="size-4 mr-2" />{buttonText}
         </Link>
      </div>
   )
}