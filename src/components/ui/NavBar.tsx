import Link from "next/link";
import { UserNav } from "./userNav";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ThemeToggler";
import Image from "next/image";


export function NavBar() {

    return (
        <nav className="w-full border-b">
            <div className="flex items-center justify-between container mx-auto px-5 lg:px-10 py-5">
                <Link href="/" className="text-2xl">
                    <Image src='/kims_hotel_logo2 (1).png' width={100} height={100} alt="kims Hotel"/>
                </Link>
                <div className="rounded-full border px-5 py-2">
                    <h1>Hello from the search</h1>
                </div>
                <div className=" space-x-3 flex justify-center items-center">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <UserNav />
                    <ModeToggle />
                </div>


            </div>
        </nav>

    )
}