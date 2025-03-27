"use client";

import React, { useState, useEffect } from "react";
import { useUser, SignInButton, SignedOut, SignOutButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import Link from "next/link";
import { AlignRight } from "lucide-react";
import { CreateAddUser, userHasRoles } from "@/app/(action)/user.action";

export function UserNav() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const fullname = user?.fullName;


  const [userRoles, setUserRoles] = useState<string[]>([]);


  useEffect(() => {
    const fetchUserRoles = async () => {
      const rolesData = await userHasRoles();
      if (rolesData && rolesData.roles) {
        setUserRoles(rolesData.roles);
      }
     
    };
    if (user) {
      fetchUserRoles();
    }
  }, [user]);


  useEffect(() => {
    const initUser = async () => {
      if (email && fullname) {
        await CreateAddUser();
      }
    };
    initUser();
  }, [email, fullname]);


  const hasRole = (roleName: string): boolean => {
    return userRoles.includes(roleName);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full border outline-none px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
          <AlignRight />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
      <DropdownMenuItem>
              <Link href="/type-etablissement" className="w-full text-md text-start">
                Ajouter Mon Etablissement Chez Kims
              </Link>
            </DropdownMenuItem>
           
        {user ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/">Mes Annonces</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/favorites">Mes Favoris</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/">Mes Reservations</Link>
            </DropdownMenuItem>
            {hasRole("ADMIN") && (
              <DropdownMenuItem>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            
            
            <DropdownMenuItem>
              <SignOutButton>
                <button className="w-full text-left">Se déconnecter</button>
              </SignOutButton>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <SignedOut>
              
              <DropdownMenuItem>
                <SignInButton>
                  <button className="w-full text-left">Se Connecter</button>
                </SignInButton>
              </DropdownMenuItem>
            </SignedOut>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
