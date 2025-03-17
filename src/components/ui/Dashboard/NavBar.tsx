import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ModeToggle } from "../ThemeToggler";


export function NavBar(){
    return (
        <div className="bg-primary dark:bg-slate-700 text-white py-2 px-5 flex justify-between">
            <Link href='/'>Kims Hotel</Link>
            <div className="flex justify-center items-center gap-5">
            <UserButton/>
            <ModeToggle />
            </div>
        </div>
    )
}