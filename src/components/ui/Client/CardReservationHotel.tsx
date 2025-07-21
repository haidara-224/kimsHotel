'use client';

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/src/lib/auth-client";
import { Chambre } from "@/types/types";

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
    const modalRef = useRef<HTMLDivElement>(null);

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

    const totalPrice = (chambre?.price ?? 0) * getNumberOfNights();

    // Fermer la modale
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
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
            <div 
                ref={modalRef}
                className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold">Réservation - {chambre.type}</h2>
                    <p className="text-sm text-gray-500">{chambre.description}</p>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 p-4 space-y-4">
                    {/* Price & Availability */}
                    <div className="flex justify-between items-center pb-2 border-b">
                        <div>
                            <span className="text-lg font-bold">{formatPrice(chambre.price)}</span>
                            <span className="text-sm text-gray-500"> /nuit</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${chambre.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {chambre.disponible ? 'Disponible' : 'Occupée'}
                        </span>
                    </div>

                    {/* Date Inputs */}
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Arrivée</label>
                            <input
                                type="date"
                                className="w-full p-3 border rounded-lg text-sm"
                                value={dateA?.toISOString().split('T')[0] || ''}
                                onChange={(e) => setDateA(e.target.value ? new Date(e.target.value) : undefined)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Départ</label>
                            <input
                                type="date"
                                className="w-full p-3 border rounded-lg text-sm"
                                value={dateD?.toISOString().split('T')[0] || ''}
                                onChange={(e) => setDateD(e.target.value ? new Date(e.target.value) : undefined)}
                                min={dateA?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    {/* Guests Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Voyageurs</label>
                        <select
                            className="w-full p-3 border rounded-lg text-sm"
                            value={voyageurs}
                            onChange={(e) => setVoyageurs(e.target.value)}
                        >
                            {[...Array(10)].map((_, i) => (
                                <option key={i+1} value={i+1}>
                                    {i+1} {i+1 === 1 ? "voyageur" : "voyageurs"}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price Summary */}
                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-sm">
                            <span>{formatPrice(chambre.price)} × {getNumberOfNights()} nuits</span>
                            <span>{formatPrice(chambre.price * getNumberOfNights())}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Frais de service</span>
                            <span>{formatPrice(chambre.price * getNumberOfNights() * 0.02)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total</span>
                            <span>{formatPrice(chambre.price * getNumberOfNights())}</span>
                        </div>
                    </div>

                    {dateA && dateD && (
                        <p className="text-xs text-gray-500 text-center">
                            {getNumberOfNights()} nuit(s) du {format(dateA, "dd/MM/yyyy")} au {format(dateD, "dd/MM/yyyy")}
                        </p>
                    )}
                </div>

                {/* Footer with Action Button */}
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

                                <button
                                    type="submit"
                                    disabled={!dateA || !dateD || getNumberOfNights() === 0}
                                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                                        !dateA || !dateD || getNumberOfNights() === 0
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                                    }`}
                                >
                                    Réserver maintenant
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        ) : (
                            <div className="text-center space-y-3">
                                <p className="text-sm">Connectez-vous pour réserver</p>
                                <Link 
                                    href="/auth/signin" 
                                    className="block w-full py-2 text-blue-600 font-medium rounded-lg border border-blue-600"
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