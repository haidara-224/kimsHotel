"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./dropdown-menu";
import { Button } from "./button";
import { signOut, useSession } from "@/src/lib/auth-client";
import Image from "next/image";
import { User2 } from "lucide-react";

function UserButton() {
    const { data: session, } = useSession();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 ">
                    {
                        session?.user.image ?
                            <Image
                                src={session?.user.image}
                                width={100}
                                height={100}
                                alt="Kims Hotel"
                                className="w-16 h-auto rounded-full transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3"
                            /> :
                            <User2 size={32}/>
                    }

                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="pb-2">
                <DropdownMenuLabel>Information Utilisateur</DropdownMenuLabel>
                <DropdownMenuItem
                    className="cursor-pointer py-1 focus:bg-transparent focus:underline"
                    asChild
                >
                    <p>
                 
                        {session?.user.name}
                    </p>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer py-1 focus:bg-transparent focus:underline"
                    asChild
                >
                    <p>
                        
                        {session?.user.email}
                    </p>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer py-1 focus:bg-transparent focus:underline"
                    asChild
                >
                    <button onClick={() => signOut()} className="w-full text-left">
                        Se Déconnecter
                    </button>


                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export { UserButton };
