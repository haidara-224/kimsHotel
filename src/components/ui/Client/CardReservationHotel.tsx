import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
import { ArrowRight } from "lucide-react";

import { format } from "date-fns";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Chambre } from "@/types/types";
import { useEffect, useState } from "react";
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../dialog";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";

interface HotelProps {
    chambre: Chambre | null,
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CardReservationHotel({ chambre, open, onOpenChange }: HotelProps) {
    const [dateD, setDateD] = React.useState<string>("");
    const [dateA, setDateA] = React.useState<string>("");
    const { user } = useUser()
    const [voyageurs, setVoyageurs] = useState<string>("1");

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF' }).format(price);
    };

    const getNumberOfNights = () => {
        const start = new Date(dateA);
        const end = new Date(dateD);
        if (!dateA || !dateD || end < start) return 0;
        const diffTime = end.getTime() - start.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const [, setNights] = useState(0);

    useEffect(() => {
        if (dateA && dateD) {
            const start = new Date(dateA);
            const end = new Date(dateD);
            const diffTime = end.getTime() - start.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setNights(diffDays >= 0 ? diffDays : 0);
        } else {
            setNights(0);
        }
    }, [dateA, dateD]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Réservation - type Chambre: {chambre?.type}</DialogTitle>
                    <DialogDescription>{chambre?.description}</DialogDescription>
                </DialogHeader>

                <span className="p-4 space-y-4">
                    <span className="flex items-center justify-between pb-2 border-b">
                        <span>
                            <span className="text-xl font-bold text-foreground">{formatPrice(chambre?.price ?? 0)}</span>
                            <span className="text-sm text-muted-foreground">par nuit</span>
                        </span>
                        <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                            {chambre?.disponible ? '⚡ Disponible' : '⛔ Occupée'}
                        </Badge>
                    </span>

                    <span className="space-y-3">
                        <span className="grid grid-cols-1 gap-4">
                            <span className="space-y-3 w-full">
                                <Label className="text-muted-foreground">Arrivée</Label>
                                <input
                                    type="date"
                                    className="w-full border rounded-md px-4 py-2"
                                    value={dateA}
                                    onChange={(e) => setDateA(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </span>
                            <span className="space-y-3 w-full">
                                <Label className="text-muted-foreground">Départ</Label>
                                <input
                                    type="date"
                                    className="w-full border rounded-md px-4 py-2"
                                    value={dateD}
                                    onChange={(e) => setDateD(e.target.value)}
                                    min={dateA}
                                />
                            </span>
                        </span>

                        <Separator className="bg-border/30" />

                        <span className="space-y-1">
                            <Label className="text-muted-foreground">Voyageurs</Label>
                            <Select onValueChange={(value) => setVoyageurs(value)} defaultValue="1">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={`${voyageurs} voyageur`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[...Array(10)].map((_, i) => (
                                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                                            {i + 1} {i + 1 === 1 ? "voyageur" : "voyageurs"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </span>
                    </span>

                    {chambre?.disponible && (
                        <form action="https://mapaycard.com/epay/" method="POST">
                            <input type="hidden" name="c" value="NTY4Nzk1MTU" />
                           {
                            /**
                             *  <input
                                type="hidden"
                                name="paycard-amount"
                                value={(chambre?.price ?? 0) * getNumberOfNights()}
                                readOnly
                            />
                             */
                           }
                            <input
                                    type="hidden"
                                    name="paycard-amount"
                                    value="1000"
                                    readOnly
                                />
                            <input type="hidden" name="paycard-description" value={`reservation de chambre ${chambre.numero_chambre}`} />
                            <input type="hidden" name="paycard-callback-url" value={`https://kimshotel.net/check_payment/hotel/${chambre.id}/${user?.id}`} />
                            <input type="hidden" name="paycard-redirect-with-get" value="on" />
                            <input type="hidden" name="paycard-auto-redirect" value="off" />
                            <input type="hidden" name="order_id" value={`res-${Date.now()}`} />

                            <SignedIn>
                                <Button
                                    className="w-full h-10 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-rose-500/30 transition-all"
                                    disabled={!dateA || !dateD}
                                >
                                    Réserver maintenant
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </SignedIn>
                            <SignedOut>
                                <h1>Veuillez vous connectez d&apos;abord avant de pouvoir reserver</h1>
                                <Link href="/sign-in" className="w-full text-left text-primary">Se Connecter</Link>
                            </SignedOut>
                        </form>
                    )}

                    <span className="space-y-3 pt-3">
                        <span className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{formatPrice(chambre?.price ?? 0)}  ×  {getNumberOfNights()}  nuits</span>
                            <span className="font-medium">{formatPrice((chambre?.price ?? 0) * getNumberOfNights())}</span>
                        </span>
                        <span className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Frais de service de Kims</span>
                            <span className="font-medium">{formatPrice((chambre?.price ?? 0) * getNumberOfNights() * 0.02)}</span>
                        </span>
                    </span>

                    <Separator className="bg-border/30" />
                    <span className="text-sm text-muted-foreground italic">
                        {voyageurs} {voyageurs === "1" ? "voyageur" : "voyageurs"} – {getNumberOfNights()} nuit(s)
                    </span>
                    <span className="flex justify-between text-sm">
                        <span className="font-bold">Total</span>
                        <span className="font-medium">{formatPrice((chambre?.price ?? 0) * getNumberOfNights())}</span>
                    </span>
                    {dateA && dateD && (
                        <p className="text-sm text-muted-foreground">
                            {getNumberOfNights()} nuit(s) du {format(new Date(dateA), "PPP")} au {format(new Date(dateD), "PPP")}
                        </p>
                    )}
                </span>
            </DialogContent>
        </Dialog>
    );
}
