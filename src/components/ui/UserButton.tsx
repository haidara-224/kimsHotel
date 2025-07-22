"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./dropdown-menu"
import { Button } from "./button"
import { signOut, useSession } from "@/src/lib/auth-client"
import Image from "next/image"
import { LogOut, User2 } from "lucide-react"
import { cn } from "@/src/lib/utils"

function UserButton() {
    const { data: session } = useSession()
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    className={cn(
                        "p-0 rounded-full",
                        "hover:bg-gray-100 dark:hover:bg-gray-800",
                        "transition-all duration-200"
                    )}
                >
                    {session?.user.image ? (
                        <Image
                            src={session.user.image}
                            width={40}
                            height={40}
                            alt="Photo de profil"
                            className={cn(
                                "w-14 h-14 rounded-full border-2",
                                "border-gray-200 dark:border-gray-700",
                                "hover:scale-105 transition-transform"
                            )}
                        />
                    ) : (
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            "bg-gray-100 dark:bg-gray-700",
                            "border-2 border-gray-200 dark:border-gray-600"
                        )}>
                            <User2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </div>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className={cn(
                    "w-64 p-2 rounded-lg",
                    "bg-white dark:bg-gray-800",
                    "border border-gray-200 dark:border-gray-700",
                    "shadow-lg"
                )}
                align="end"
            >
                <DropdownMenuLabel className={cn(
                    "px-2 py-1.5 text-sm font-medium",
                    "text-gray-700 dark:text-gray-300"
                )}>
                    Information Utilisateur
                </DropdownMenuLabel>
                
                <DropdownMenuItem className={cn(
                    "px-2 py-1.5 rounded-md",
                    "text-gray-800 dark:text-gray-200",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    "focus:bg-gray-100 dark:focus:bg-gray-700",
                    "transition-colors"
                )}>
                    <p className="truncate font-medium">
                        {session?.user.name}
                    </p>
                </DropdownMenuItem>
                
                <DropdownMenuItem className={cn(
                    "px-2 py-1.5 rounded-md",
                    "text-gray-600 dark:text-gray-400",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    "focus:bg-gray-100 dark:focus:bg-gray-700",
                    "transition-colors"
                )}>
                    <p className="truncate text-sm">
                        {session?.user.email}
                    </p>
                </DropdownMenuItem>
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                
                <DropdownMenuItem 
                    className={cn(
                        "px-2 py-1.5 rounded-md text-red-600 dark:text-red-400",
                        "hover:bg-red-50 dark:hover:bg-red-900/30",
                        "focus:bg-red-50 dark:focus:bg-red-900/30",
                        "transition-colors"
                    )}
                    onClick={() => signOut()}
                >
                    <div className="flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        <span>Se Déconnecter</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export { UserButton }