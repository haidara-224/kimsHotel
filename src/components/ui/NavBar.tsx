'use client'
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UserNav } from "./userNav";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ThemeToggler";
import Image from "next/image";
import { useState } from "react";


export function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-teal-600 text-2xl mr-2">
                            <Link href="/" className="text-2xl">
                                <Image src='/kims_hotel_logo2 (1).png' width={100} height={100} layout="intrinsic" alt="kims Hotel" />
                            </Link>
                        </span>

                    </div>
                    <div className="hidden md:flex justify-center items-center space-x-6">
                 
                        <AnimatedLink href="/">Mes Annonces</AnimatedLink>
                        <AnimatedLink href="/favorites">Mes Favoris</AnimatedLink>
                        <AnimatedLink href="/">Mes Reservations</AnimatedLink>
                    
                    </div>
                    <div className="hidden md:flex  space-x-7  justify-center items-center rounded-full border outline-none px-2 py-2 lg:px-4 lg:py-2">
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                        <UserNav />
                        <ModeToggle />
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                <Link href="/" className="text-gray-600 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium">Mes Annonces</Link>
                                <Link href="/favorites" className="text-gray-600 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium">Mes Favoris</Link>
                                <Link href="/" className="text-gray-600 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium">Mes Reservations</Link>
                                <div className="space-x-7 flex justify-center items-center rounded-full border outline-none px-2 py-2 lg:px-4 lg:py-2">
                                    <SignedIn>
                                        <UserButton />
                                    </SignedIn>
                                    <UserNav />
                                    <ModeToggle />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>


        </>


    )
}


function AnimatedLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="relative px-3 py-2 text-gray-600 hover:text-teal-600 text-md font-medium group"
        >
            <span>{children}</span>
 
            <motion.span
                className="absolute left-0 bottom-0 h-[2px] w-full bg-teal-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            />
            <motion.span
                className="absolute right-0 top-0 h-[2px] w-full bg-teal-600 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            />
        </Link>
    );
}


