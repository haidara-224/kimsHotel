'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
    BellIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    SearchIcon,
} from "lucide-react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useSession } from "@/src/lib/auth-client";


export default function Page() {
  const { data: session, } = useSession();

    const incomingOccupants = [
        {
            name: "Jonathan D.",
            image: "/jonathan.jpg",
            type: "GROOMING",
            dates: "Feb 12 - Feb 14",
            amount: "$120",
            status: "Unpaid balance: $120",
            needsPaymentLink: true,
        },
        {
            name: "Jessica P.",
            image: "/jessica.jpg",
            type: "DAYCARE",
            dates: "Feb 12 - Feb 14",
            amount: "$130",
            status: "Paid",
            needsPaymentLink: false,
        },
    ];

    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 py-8">
            {/* Colonne de gauche */}
            <div className="col-span-2 bg-white dark:bg-zinc-900 shadow-lg rounded-lg p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={session?.user.image ?? undefined} alt={session?.user.name || "User"} />
                            <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-xl text-gray-800 dark:text-white">
                            {session?.user.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 ml-auto w-full lg:w-auto">
                        <div className="relative flex-1 lg:flex-none">
                            <Input
                                placeholder="Search"
                                className="pl-9 pr-4 py-2 rounded-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 w-full text-gray-900 dark:text-white"
                            />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-300" />
                        </div>

                        <div className="relative">
                            <BellIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                                1
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4 mt-6">
                        <h3 className="font-medium text-lg text-gray-800 dark:text-white">Incoming occupants</h3>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ChevronLeftIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {incomingOccupants.map((occupant, index) => (
                            <Card
                                key={index}
                                className="overflow-hidden shadow-lg rounded-xl border border-gray-100 dark:border-zinc-700 hover:shadow-2xl"
                            >
                                <CardContent className="p-0">
                                    <div
                                        className={`p-4 flex flex-col items-center rounded-t-lg ${
                                            occupant.needsPaymentLink
                                                ? "bg-teal-500"
                                                : "bg-white dark:bg-zinc-900"
                                        }`}
                                    >
                                        <Avatar className="h-16 w-16 mb-2 border-2 border-white">
                                            <AvatarImage src={occupant.image} alt={occupant.name} />
                                            <AvatarFallback>{occupant.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="text-center">
                                            <h4
                                                className={`font-medium ${
                                                    occupant.needsPaymentLink
                                                        ? "text-white"
                                                        : "text-gray-800 dark:text-white"
                                                }`}
                                            >
                                                {occupant.name}
                                            </h4>
                                            <Badge
                                                className={`mt-1 ${
                                                    occupant.needsPaymentLink
                                                        ? "bg-white text-teal-500"
                                                        : "bg-teal-100 text-teal-600 dark:bg-teal-700 dark:text-teal-100"
                                                }`}
                                            >
                                                {occupant.type}
                                            </Badge>
                                        </div>
                                        <div
                                            className={`text-sm mt-2 ${
                                                occupant.needsPaymentLink
                                                    ? "text-white"
                                                    : "text-gray-500 dark:text-gray-400"
                                            }`}
                                        >
                                            {occupant.dates}
                                        </div>
                                        {occupant.needsPaymentLink && (
                                            <div className="mt-2 text-white text-sm">{occupant.status}</div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col items-center bg-gray-50 dark:bg-zinc-800 rounded-b-lg">
                                        <div className="text-xl font-medium text-gray-800 dark:text-white">
                                            {occupant.amount}
                                        </div>
                                        <div
                                            className={`text-sm ${
                                                occupant.needsPaymentLink
                                                    ? "text-gray-500"
                                                    : "text-green-500 dark:text-green-400"
                                            }`}
                                        >
                                            {!occupant.needsPaymentLink && occupant.status}
                                        </div>
                                        {occupant.needsPaymentLink && (
                                            <Button className="mt-2 bg-teal-600 hover:bg-teal-700 text-white text-sm py-2 px-4 rounded-md">
                                                Send Payment Link
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Colonne de droite : calendrier */}
            <div className="mt-8 bg-white dark:bg-zinc-900 shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-medium mb-4 text-gray-800 dark:text-white">Occupants Calendar</h3>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={[
                        { title: 'Jonathan D.', start: '2024-02-12', end: '2024-02-14' },
                        { title: 'Jessica P.', start: '2024-02-12', end: '2024-02-14' },
                        { title: 'Lilliana M. - Grooming', start: '2024-02-12', end: '2024-02-14' },
                        { title: 'Lilliana M. - Daycare', start: '2024-02-12', end: '2024-02-14' },
                    ]}
                    height="auto"
                />
            </div>
        </section>
    );
}
