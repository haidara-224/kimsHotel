import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
import { ArrowRight, CalendarIcon } from "lucide-react";

import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";

import { Calendar } from "@/src/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Chambre } from "@/types/types";
import { useState } from "react";
import React from "react";
//import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../dialog";

interface HotelProps {
    chambre: Chambre | null,
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CardReservationHotel({ chambre, open, onOpenChange }: HotelProps) {
    const [dateD, setDateD] = React.useState<Date>();
    const [dateA, setDateA] = React.useState<Date>();

    const [voyageurs, setVoyageurs] = useState<string>("1");
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF' }).format(price);
    };
    const getNumberOfNights = () => {
        if (!dateA || !dateD) return 0;
        const diffTime = dateD.getTime() - dateA.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };
    const resetForm = () => {

        setDateD(undefined);
        setDateA(undefined);
        setVoyageurs("1");
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Réservation - type Chambre: {chambre?.type}</DialogTitle>
                        <DialogDescription>
                            {chambre?.description}
                        </DialogDescription>
                    </DialogHeader>
                    <span className="p-4 space-y-4">
                        <span className="flex items-center justify-between pb-2 border-b">
                            <span>
                                <span className="text-xl font-bold text-foreground"> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF' }).format(chambre?.price ? chambre.price : 0)}</span>
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
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                                <CalendarIcon />
                                                {dateA ? format(dateA, "PPP") : <span>{format(new Date(), "PPP")}</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={dateA} onSelect={setDateA} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </span>

                                <span className="space-y-1">
                                    <Label className="text-muted-foreground">Départ</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                                <CalendarIcon />
                                                {dateD ? format(dateD, "PPP") : <span>{format(new Date(), "PPP")}</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={dateD} onSelect={setDateD} initialFocus />
                                        </PopoverContent>
                                    </Popover>
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
                        {
                            chambre?.disponible && (
                                <Button className="w-full h-10 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-rose-500/30 transition-all">
                                    Réserver maintenant
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            )
                        }


                        <span className="space-y-3 pt-3">
                            <span className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{formatPrice(chambre?.price ? chambre.price : 0)}  ×  {getNumberOfNights()}  nuits</span>
                                <span className="font-medium">{formatPrice((chambre?.price ? chambre.price : 0) * getNumberOfNights())}</span>
                            </span>

                            <span className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Frais de service de Kims</span>
                                <span className="font-medium">{formatPrice((chambre?.price ? chambre.price : 0) * getNumberOfNights() * 0.02)}</span>
                            </span>
                        </span>

                        <Separator className="bg-border/30" />

                        <span className="flex justify-between text-sm">
                            <span className="font-bold">Total</span>
                            <span className="font-medium">{formatPrice((chambre?.price ? chambre.price : 0) * getNumberOfNights())}</span>
                        </span>
                    </span>

                    <DialogFooter>
                        <Button onClick={resetForm}>Annuler</Button>

                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
