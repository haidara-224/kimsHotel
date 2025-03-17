import { Card, CardContent } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
import { ArrowRight, CalendarIcon } from "lucide-react";

import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { cn } from "@/src/lib/utils";
import { Calendar } from "@/src/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Logement } from "@/types/types";
import { useState } from "react";
import React from "react";

interface logementProps {
    logement: Logement
}
export function CardReservationLogement({ logement }: logementProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF' }).format(price);
    };

    const [dateD, setDateD] = React.useState<Date>()
    const [dateA, setDateA] = React.useState<Date>()

    const [voyageurs, setVoyageurs] = useState<string>("1");
    const getNumberOfNights = () => {
        if (!dateA || !dateD) return 0;
        const diffTime = dateD.getTime() - dateA.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convertir en jours
        return diffDays > 0 ? diffDays : 0;
    };
    return (
        <>
            <Card className="border-border/50 hover:border-border/80 transition-colors shadow-xl hover:shadow-2xl">
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                        <div>
                            <h3 className="text-2xl font-bold text-foreground">{formatPrice(logement.price)}</h3>
                            <p className="text-sm text-muted-foreground">par nuit</p>
                        </div>
                        <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                            ⚡ Disponible
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1  gap-5">
                            <div className="space-y- w-full">
                                <Label className="text-muted-foreground">Arrivée</Label>
                                <div className="font-medium text-foreground">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full  justify-start text-left font-normal",
                                                    !dateA && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon />
                                                {dateA ? format(dateA, "PPP") : <span>{format(new Date(), "PPP")}</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={dateA}
                                                onSelect={setDateA}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Départ</Label>
                                <div className="font-medium text-foreground">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full  justify-start text-left font-normal",
                                                    !dateD && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon />
                                                {dateD ? format(dateD, "PPP") : <span>{format(new Date(), "PPP")}</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={dateD}
                                                onSelect={setDateD}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>


                        <Separator className="bg-border/30" />

                        <div className="space-y-1">
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
                        </div>
                    </div>

                    <Button className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-rose-500/30 transition-all">
                        Réserver maintenant
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="space-y-4 pt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{formatPrice(logement.price)}  ×  {getNumberOfNights()} nuits</span>
                            <span className="font-medium">{formatPrice(logement.price * getNumberOfNights())} </span>
                        </div>
                        {
                            /*
                             <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Frais de ménage</span>
                            <span className="font-medium">13 €</span>
                          </div>
                            */
                        }

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Frais de service de Kims</span>
                            <span className="font-medium">{formatPrice(logement.price * getNumberOfNights() * 0.02)}</span>
                        </div>
                    </div>

                    <Separator className="bg-border/30" />

                    <div className="flex justify-between text-sm">
                        <span className="font-bold">
                            Total
                        </span>
                        <span className="font-medium">
                            {formatPrice(logement.price * getNumberOfNights())}
                        </span>
                    </div>



                </CardContent>
            </Card></>
    )
}