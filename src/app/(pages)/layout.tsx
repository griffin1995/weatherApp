"use client"

import { Toaster } from "@/components/ui/toaster";
import MenuButton from "@/components/MenuButton";
import { usePathname } from "next/navigation";


export default function PagesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const path = usePathname()

    return (
        <div className="bg-blue-900 p-5 min-h-screen  max-w-screen-2xl mx-auto">
            <div className="flex gap-x-5 items-center">
            <MenuButton/>
            <h1 className="text-3xl font-bold text-white">{path.charAt(1).toUpperCase() + path.substring(2)}</h1>
            </div>
            
                <div className="text-white min-h-screen w-full">
                    {children}
                </div>
            <Toaster />
        </div>
    );
}