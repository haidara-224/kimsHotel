'use client'


import { BackButton } from "@/src/components/ui/Dashboard/backButton";

import { LogementTableUser } from "@/src/components/ui/Dashboard/LogementTableUser";
import { useSession } from "@/src/lib/auth-client";









export default function Page() {

    const { data: session, } = useSession();
    return (
        <>
            <BackButton text="Dashboard" link={`/dashboard/hotes/${session?.user?.id}`} />
            <LogementTableUser />

        </>
    )
}