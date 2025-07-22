'use client';

import { useState, useEffect, useRef } from "react";
import { format, isBefore, isAfter, } from "date-fns";
import { fr } from 'date-fns/locale';
import { ArrowRight, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/src/lib/auth-client";
import { Chambre } from "@/types/types";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";

interface HotelProps {
    chambre: Chambre | null,
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CardReservationHotel({ chambre, open, onOpenChange }: HotelProps) {
    const [dateD, setDateD] = useState<Date>();
    const [dateA, setDateA] = useState<Date>();
    const { data: session } = useSession();
    const [voyageurs, setVoyageurs] = useState("1");
    const [dateError, setDateError] = useState("");
    const modalRef = useRef<HTMLDivElement>(null);
    const popoverArrivalRef = useRef<HTMLDivElement>(null);
    const popoverDepartureRef = useRef<HTMLDivElement>(null);
      const selectTriggerRef = useRef<HTMLButtonElement>(null);


    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getNumberOfNights = () => {
        if (!dateA || !dateD) return 0;
        const diffTime = Math.max(0, dateD.getTime() - dateA.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
 const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };
    const totalPrice = (chambre?.price ?? 0) * getNumberOfNights();

    const handleDateChange = (type: 'arrival' | 'departure', date: Date | undefined) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date) {
            if (isBefore(date, today)) {
                setDateError("Les dates antérieures à aujourd'hui ne sont pas autorisées");
                return;
            }

            if (type === 'arrival' && dateD && isAfter(date, dateD)) {
                setDateError("La date d'arrivée doit être avant la date de départ");
                return;
            }

            if (type === 'departure' && dateA && isBefore(date, dateA)) {
                setDateError("La date de départ doit être après la date d'arrivée");
                return;
            }
        }

        setDateError("");
        if (type === 'arrival') {
            setDateA(date);
            if (date && dateD && isBefore(dateD, date)) {
                setDateD(undefined);
            }
        } else {
            setDateD(date);
        }
    };

   useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!modalRef.current) return;
            
            // Vérifier si le clic est à l'intérieur d'un Popover
            const isInsidePopover = 
                (popoverArrivalRef.current?.contains(e.target as Node)) ||
                (popoverDepartureRef.current?.contains(e.target as Node));
            
            // Vérifier si le clic est sur le trigger du Select
            const isSelectTrigger = selectTriggerRef.current?.contains(e.target as Node);
            
            if (!isInsidePopover && !isSelectTrigger && !modalRef.current.contains(e.target as Node)) {
                onOpenChange(false);
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onOpenChange(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onOpenChange]);

    if (!open || !chambre) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div ref={modalRef} className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col shadow-xl">

                <div className="p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold">Réservation - {chambre.type}</h2>
                    <p className="text-sm text-gray-500 mt-1">{chambre.description}</p>
                </div>


                <div className="overflow-y-auto flex-1 p-4 space-y-4">

                    <div className="flex justify-between items-center pb-2 border-b">
                        <div>
                            <span className="text-lg font-bold">{formatPrice(chambre.price)}</span>
                            <span className="text-sm text-gray-500 ml-1">/nuit</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${chambre.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {chambre.disponible ? 'Disponible' : 'Occupée'}
                        </span>
                    </div>

                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Arrivée</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal h-12"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateA ? format(dateA, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    ref={popoverArrivalRef}
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={dateA}
                                        onSelect={(date: Date | undefined) => handleDateChange('arrival', date)}
                                        disabled={(date: Date) => date < new Date()}
                                        initialFocus
                                        locale={fr}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Départ</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal h-12"
                                        disabled={!dateA}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateD ? format(dateD, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    ref={popoverDepartureRef}
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={dateD}
                                        onSelect={(date: Date | undefined) => handleDateChange('departure', date)}
                                        disabled={(date: Date) =>
                                            date < new Date() ||
                                            (dateA ? date <= dateA : false)
                                        }
                                        initialFocus
                                        locale={fr}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {dateError && (
                        <div className="text-red-500 text-sm text-center py-2">{dateError}</div>
                    )}


                   <div>
                    <label className="block text-sm font-medium mb-1">Voyageurs</label>
                    <Select value={voyageurs} onValueChange={setVoyageurs}>
                        <SelectTrigger 
                            ref={selectTriggerRef}
                            className="h-12"
                            onClick={stopPropagation}
                        >
                            <SelectValue placeholder="Nombre de voyageurs" />
                        </SelectTrigger>
                        {/* Ajout de onClick et stopPropagation sur SelectContent */}
                        <SelectContent onClick={stopPropagation}>
                            {[...Array(10)].map((_, i) => (
                                <SelectItem 
                                    key={i + 1} 
                                    value={(i + 1).toString()}
                                    onClick={stopPropagation}
                                >
                                    {i + 1} {i + 1 === 1 ? "voyageur" : "voyageurs"}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>



                    <div className="space-y-3 pt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{formatPrice(chambre.price)} × {getNumberOfNights()} nuits</span>
                            <span className="font-medium">{formatPrice(chambre.price * getNumberOfNights())}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Frais de service</span>
                            <span className="font-medium">{formatPrice(chambre.price * getNumberOfNights() * 0.02)}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between font-bold">
                            <span>Total</span>
                            <span>{formatPrice(chambre.price * getNumberOfNights())}</span>
                        </div>
                    </div>

                    {dateA && dateD && (
                        <p className="text-xs text-gray-500 text-center pt-2">
                            {getNumberOfNights()} nuit(s) du {format(dateA, "dd/MM/yyyy")} au {format(dateD, "dd/MM/yyyy")}
                        </p>
                    )}
                </div>


                <div className="p-4 border-t sticky bottom-0 bg-white">
                    {chambre.disponible ? (
                        session ? (
                            <form action="https://mapaycard.com/epay/" method="POST" target="_blank">
                                <input type="hidden" name="c" value="NTY4Nzk1MTU" />
                                {
                                    /**
                                     *  <input
                                        type="hidden"
                                        name="paycard-amount"
                                        value={totalPrice}
                                        readOnly
                                    />
                                     */
                                }
                                <input type="hidden" name="paycard-amount" value={totalPrice} />
                                <input type="hidden" name="paycard-description" value={`Réservation chambre ${chambre.numero_chambre}`} />
                                {
                                    /**
                                     *                             <input
                                    type="hidden"
                                    name="paycard-callback-url"
                                    value={
                                        `https://kimshotel.net/check_payment/hotel/${chambre.id}/${session?.user.id}/${totalPrice}` +
                                        `?dateA=${dateA ? encodeURIComponent(dateA.toISOString()) : ''}` +
                                        `&dateD=${dateD ? encodeURIComponent(dateD.toISOString()) : ''}` +
                                        `&voyageurs=${encodeURIComponent(voyageurs)}` +
                                        `&kimshotel=true`
                                    }
                                />
    
                                     */
                                }
                                <input
                                    type="hidden"
                                    name="paycard-callback-url"
                                    value={
                                        `http://localhost:3000/check_payment/hotel/${chambre.id}/${session.user.id}/${totalPrice}` +
                                        `?dateA=${dateA?.toISOString() || ''}` +
                                        `&dateD=${dateD?.toISOString() || ''}` +
                                        `&voyageurs=${voyageurs}` +
                                        `&kimshotel=true`
                                    }
                                />
                                <input type="hidden" name="paycard-redirect-with-get" value="on" />
                                <input type="hidden" name="paycard-auto-redirect" value="off" />
                                <input type="hidden" name="order_id" value={`res-${Date.now()}`} />

                                <Button
                                    type="submit"
                                    disabled={!dateA || !dateD || getNumberOfNights() === 0}
                                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${!dateA || !dateD || getNumberOfNights() === 0
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600'
                                        }`}
                                >
                                    Réserver maintenant
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center space-y-3">
                                <p className="text-sm">Connectez-vous pour réserver</p>
                                <Link
                                    href="/auth/signin"
                                    className="block w-full py-2 text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                    Se connecter
                                </Link>
                            </div>
                        )
                    ) : (
                        <div className="text-center py-3 text-red-500 font-medium">
                            Cette chambre n&apos;est pas disponible
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}