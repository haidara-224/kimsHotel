"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
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
  const [userRoles, setUserRoles] = useState<string[] | null>(null); // null = en chargement

  useEffect(() => {
    const fetchUserRoles = async () => {
      const rolesData = await userHasRoles();
      if (rolesData?.roles) {
        setUserRoles(rolesData.roles);
      } else {
        setUserRoles([]); // cas où y a pas de rôle
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

  const hasDashboardAccess = useMemo(() => {
    if (!userRoles) return false;
    return userRoles.includes("ADMIN") || userRoles.includes("SUPER_ADMIN");
  }, [userRoles]);

  if (userRoles === null) return null; // ou un loader ici

  if (!hasDashboardAccess) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full border outline-none px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
          <AlignRight className="dark:text-slate-600" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

     
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
