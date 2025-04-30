'use client'


import { BackButton } from "@/src/components/ui/Dashboard/backButton";

import { LogementTableUser } from "@/src/components/ui/Dashboard/LogementTableUser";


import { useUser } from "@clerk/nextjs";





export default function Page() {

    const { user } = useUser()
    return (
        <>
            <BackButton text="Dashboard" link={`/dashboard/hotes/${user?.id}`} />
            <LogementTableUser />

        </>
    )
}