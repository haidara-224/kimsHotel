'use client';

import { useState, useEffect } from "react";
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
    const { data: session, isPending } = useSession();
    const isAuthenticated = !!session;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isUnauthenticated = !session && !isPending;
    const [voyageurs, setVoyageurs] = useState("1");

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF' }).format(price);
    };

    const getNumberOfNights = () => {
        if (!dateA || !dateD) return 0;
        const diffTime = dateD.getTime() - dateA.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const totalPrice = (chambre?.price ?? 0) * getNumberOfNights();

    // Fermer la modale quand on clique à l'extérieur
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (open && e.target instanceof HTMLElement) {
                if (e.target.closest('.modal-content') === null) {
                    onOpenChange(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="modal-content bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
                {/* En-tête */}
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Réservation - {chambre?.type}</h2>
                    <p className="text-sm text-gray-500">{chambre?.description}</p>
                </div>

                {/* Contenu */}
                <div className="p-4 space-y-4">
                    {/* Prix et disponibilité */}
                    <div className="flex justify-between items-center pb-2 border-b">
                        <div>
                            <span className="text-lg font-bold">{formatPrice(chambre?.price ?? 0)}</span>
                            <span className="text-sm text-gray-500 ml-1">/nuit</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${chambre?.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {chambre?.disponible ? 'Disponible' : 'Occupée'}
                        </span>
                    </div>

                    {/* Dates */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Arrivée</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded-md text-sm"
                                value={dateA?.toISOString().split('T')[0] || ''}
                                onChange={(e) => setDateA(e.target.value ? new Date(e.target.value) : undefined)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Départ</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded-md text-sm"
                                value={dateD?.toISOString().split('T')[0] || ''}
                                onChange={(e) => setDateD(e.target.value ? new Date(e.target.value) : undefined)}
                                min={dateA?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    {/* Voyageurs */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Voyageurs</label>
                        <select
                            className="w-full p-2 border rounded-md text-sm"
                            value={voyageurs}
                            onChange={(e) => setVoyageurs(e.target.value)}
                        >
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1} {i + 1 === 1 ? "voyageur" : "voyageurs"}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Bouton de réservation */}
                    {chambre?.disponible && (
                        <form action="https://mapaycard.com/epay/" method="POST" target="_blank" className="pt-2">
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

                            <input type="hidden" name="paycard-amount" value="1000" readOnly />
                            <input type="hidden" name="paycard-description" value={`reservation de chambre ${chambre.numero_chambre}`} />
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
                                    `http://localhost:3000/check_payment/hotel/${chambre.id}/${session?.user.id}/${totalPrice}` +
                                    `?dateA=${dateA ? encodeURIComponent(dateA.toISOString()) : ''}` +
                                    `&dateD=${dateD ? encodeURIComponent(dateD.toISOString()) : ''}` +
                                    `&voyageurs=${encodeURIComponent(voyageurs)}` +
                                    `&kimshotel=true`
                                }
                            />
                            <input type="hidden" name="paycard-redirect-with-get" value="on" />
                            <input type="hidden" name="paycard-auto-redirect" value="off" />
                            <input type="hidden" name="order_id" value={`res-${Date.now()}`} />

                            {isAuthenticated ? (
                                <button
                                    type="submit"
                                    disabled={!dateA || !dateD}
                                    className={`w-full p-3 rounded-md font-medium flex items-center justify-center ${!dateA || !dateD ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white'}`}
                                >
                                    Réserver maintenant
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            ) : (
                                <div className="text-center space-y-2">
                                    <p className="text-sm">Veuillez vous connecter pour réserver</p>
                                    <Link href="/auth/signin" className="text-sm text-blue-600 hover:underline">Se connecter</Link>
                                </div>
                            )}
                        </form>
                    )}

                    {/* Détails du prix */}
                    <div className="space-y-2 pt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{formatPrice(chambre?.price ?? 0)} × {getNumberOfNights()} nuits</span>
                            <span>{formatPrice((chambre?.price ?? 0) * getNumberOfNights())}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Frais de service</span>
                            <span>{formatPrice((chambre?.price ?? 0) * getNumberOfNights() * 0.02)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total</span>
                            <span>{formatPrice((chambre?.price ?? 0) * getNumberOfNights())}</span>
                        </div>
                    </div>

                    {dateA && dateD && (
                        <p className="text-xs text-gray-500 text-center">
                            {getNumberOfNights()} nuit(s) du {format(new Date(dateA), "dd/MM/yyyy")} au {format(new Date(dateD), "dd/MM/yyyy")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}