'use client'

import { ReservationDasbordHotel, ReservationDasbordLogement, UpdateStatusReservation } from "@/app/(action)/reservation.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { useSession } from "@/src/lib/auth-client";
import { Reservation } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { CalendarIcon, FilterIcon, SearchIcon, UserIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";

export default function Page() {
    const { data: session } = useSession();
    const [reservationHotel, setReservationHotel] = useState<Reservation[]>([]);
    const [reservationAppartement, setReservationAppartement] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeTab, setActiveTab] = useState("hotels");

    // Calcul des statistiques
    const totalReservations = reservationHotel.length + reservationAppartement.length;
    const confirmedReservations = [...reservationHotel, ...reservationAppartement].filter(r => r.status === 'CONFIRMED').length;
    const pendingReservations = [...reservationHotel, ...reservationAppartement].filter(r => r.status === 'PENDING').length;
    const cancelledReservations = [...reservationHotel, ...reservationAppartement].filter(r => r.status === 'CANCELLED').length;
    const totalRevenue = [...reservationHotel, ...reservationAppartement]
        .filter(r => r.status === 'CONFIRMED')
        .reduce((sum, res) => sum + (res.paiement?.montant || 0), 0);

    const fetchData = async () => {
        const data = await ReservationDasbordHotel();
        setReservationHotel(data as unknown as Reservation[]);
    };

    const fetchDataAppartement = async () => {
        const data = await ReservationDasbordLogement();
        setReservationAppartement(data as unknown as Reservation[]);
    };

    useEffect(() => {
        fetchData();
        fetchDataAppartement();
    }, []);


const handleConfirm = async (reservationId: string, email: string, hotelId: string) => {
    try {
        setLoading(true);
        const updateStatus = await UpdateStatusReservation(reservationId, 'CONFIRMED');
        if (!updateStatus) {
            throw new Error("Failed to update reservation status");
        } else {
            const response = await fetch(`/api/hotel/confirmReservation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, hotelId }),
            });

            if (!response.ok) {
                throw new Error("Failed to confirm reservation");
            }

            const data = await response.json();
            console.log(data.message);
            toast.success("Reservation confirmée avec succès !");
            await fetchData(); 
            await fetchDataAppartement(); 
        }
    } catch (error) {
        console.error("Error confirming reservation:", error);
        toast.error("Erreur lors de la confirmation");
    } finally {
        setLoading(false);
    }
};

const handleCancel = async (reservationId: string, email: string, hotelId: string) => {
    try {
        const updateStatus = await UpdateStatusReservation(reservationId, 'CANCELLED');
        if (!updateStatus) {
            throw new Error("Failed to update reservation status");
        }
        if (updateStatus) {
            const response = await fetch(`/api/hotel/cancelReservation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, hotelId }),
            });

            if (!response.ok) {
                throw new Error("Failed to cancel reservation");
            }

            const data = await response.json();
            console.log(data.message);
            await fetchData(); 
            await fetchDataAppartement(); 
            toast.success("Reservation annulée avec succès !");
        }
    } catch (error) {
        console.error("Error canceling reservation:", error);
        toast.error("Erreur lors de l'annulation");
    }
};

const handleConfirmLogement = async (reservationId: string, email: string, logementId: string) => {
    try {
        setLoading(true);
        const updateStatus = await UpdateStatusReservation(reservationId, 'CONFIRMED');
        if (!updateStatus) {
            throw new Error("Failed to update reservation status");
        } else {
            const response = await fetch(`/api/appartement/confirmReservation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, logementId }),
            });

            if (!response.ok) {
                throw new Error("Failed to confirm reservation");
            }

            const data = await response.json();
            console.log(data.message);
            toast.success("Reservation confirmée avec succès !");
            await fetchData(); 
            await fetchDataAppartement(); 
        }
    } catch (error) {
        console.error("Error confirming reservation:", error);
        toast.error("Erreur lors de la confirmation");
    } finally {
        setLoading(false);
    }
};

const handleCancelLogement = async (reservationId: string, email: string, logementId: string) => {
    try {
        const updateStatus = await UpdateStatusReservation(reservationId, 'CANCELLED');
        if (!updateStatus) {
            throw new Error("Failed to update reservation status");
        }
        if (updateStatus) {
            const response = await fetch(`/api/appartement/cancelReservation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, logementId }),
            });

            if (!response.ok) {
                throw new Error("Failed to cancel reservation");
            }

            const data = await response.json();
            console.log(data.message);
            await fetchData(); 
            await fetchDataAppartement(); 
            toast.success("Reservation annulée avec succès !");
        }
    } catch (error) {
        console.error("Error canceling reservation:", error);
        toast.error("Erreur lors de l'annulation");
    }
};

    // Fonctions de filtrage
    const filteredHotelReservations = reservationHotel.filter(res => {
        const matchesSearch = res.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             res.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             res.chambre.hotel.nom.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || res.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const filteredAppartementReservations = reservationAppartement.filter(res => {
        const matchesSearch = res.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             res.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             res.logement.nom.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || res.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header avec avatar et stats */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-primary">
                            <AvatarImage src={session?.user.image ?? undefined} alt={session?.user.name || "User"} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                                {session?.user?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                                {session?.user.name}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Tableau de bord des réservations
                            </p>
                        </div>
                    </div>

                    {/* Cartes de statistiques */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Réservations
                                </CardTitle>
                                <UserIcon className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalReservations}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Confirmées
                                </CardTitle>
                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{confirmedReservations}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    En attente
                                </CardTitle>
                                <ClockIcon className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{pendingReservations}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Annulées
                                </CardTitle>
                                <XCircleIcon className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{cancelledReservations}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Barre de recherche et filtres */}
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Rechercher par nom, email ou hôtel..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <FilterIcon className="h-4 w-4 text-gray-500" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrer par statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tous les statuts</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmées</SelectItem>
                                <SelectItem value="PENDING">En attente</SelectItem>
                                <SelectItem value="CANCELLED">Annulées</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Onglets */}
                <Tabs defaultValue="hotels" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-xs">
                        <TabsTrigger value="hotels" onClick={() => setActiveTab("hotels")}>
                            Hôtels
                        </TabsTrigger>
                        <TabsTrigger value="appartements" onClick={() => setActiveTab("appartements")}>
                            Appartements
                        </TabsTrigger>
                    </TabsList>

                    {/* Contenu des onglets */}
                    <TabsContent value="hotels">
                        {filteredHotelReservations.length <= 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Aucune réservation d&apos;hôtel pour le moment</p>
                            </div>
                        ) : (
                            <div className="border rounded-lg overflow-hidden shadow-sm">
                                <Table className="min-w-full">
                                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                                        <TableRow>
                                            <TableHead className="font-bold">Hôtel</TableHead>
                                            <TableHead className="font-bold">Chambre</TableHead>
                                            <TableHead className="font-bold hidden lg:table-cell">Client</TableHead>
                                            <TableHead className="font-bold hidden lg:table-cell">Email</TableHead>
                                            <TableHead className="font-bold hidden lg:table-cell">
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="h-4 w-4" />
                                                    <span>Dates</span>
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-bold hidden lg:table-cell">Personnes</TableHead>
                                            <TableHead className="font-bold hidden lg:table-cell">Montant</TableHead>
                                            <TableHead className="font-bold hidden lg:table-cell">Référence</TableHead>
                                            <TableHead className="font-bold">Statut</TableHead>
                                            <TableHead className="font-bold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredHotelReservations.map((res) => (
                                            <TableRow key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <TableCell>
                                                    <div className="font-medium">{res.chambre.hotel.nom}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">#{res.chambre.numero_chambre}</Badge>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={res.user.image ?? undefined} />
                                                            <AvatarFallback>{res.user.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        {res.user.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <a href={`mailto:${res.user.email}`} className="text-blue-600 hover:underline">
                                                        {res.user.email}
                                                    </a>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{formatDate(typeof res.startDate === "string" ? res.startDate : res.startDate.toISOString())}</span>
                                                        <span className="text-xs text-gray-500">au</span>
                                                        <span className="text-sm">{formatDate(typeof res.endDate === "string" ? res.endDate : res.endDate.toISOString())}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <Badge variant="secondary">{res.nbpersonne}</Badge>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <span className="font-medium">
                                                        {res.paiement?.montant.toLocaleString()} GNF
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <code className="text-xs">{res.paiement?.transaction_reference}</code>
                                                 </TableCell>
                                                <TableCell>
                                                    {res.status === 'CONFIRMED' ? (
                                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                            Confirmée
                                                        </Badge>
                                                    ) : res.status === 'PENDING' ? (
                                                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                            En attente
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                            Annulée
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            onClick={() => handleConfirm(res.id, res.user.email, res.chambre.hotel.id)} 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                                            disabled={loading || res.status === 'CONFIRMED'}
                                                        >
                                                            {loading ? "..." : "Confirmer"}
                                                        </Button>
                                                        <Button 
                                                            onClick={() => handleCancel(res.id, res.user.email, res.chambre.hotel.id)} 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                                            disabled={loading || res.status === 'CANCELLED'}
                                                        >
                                                            {loading ? "..." : "Annuler"}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="appartements">
                        {filteredAppartementReservations.length <= 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Aucune réservation d&apos;appartement pour le moment</p>
                            </div>
                        ) : (
                            <div className="border rounded-lg overflow-hidden shadow-sm">
                                <Table className="min-w-full">
                                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                                        <TableRow>
                                            <TableHead className="font-bold">Appartement</TableHead>
                                            <TableHead className="font-bold hidden lg:table-cell">Client</TableHead>
                                            <TableHead className="font-bold hidden lg:table-cell">Email</TableHead>
                                            <TableHead className="font-bold hidden lg:table-cell">
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="h-4 w-4" />
                                                    <span>Dates</span>
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-bold hidden lg:table-cell">Personnes</TableHead>
                                            <TableHead className="font-bold hidden lg:table-cell">Montant</TableHead>
                                            <TableHead className="font-bold hidden lg:table-cell">Référence</TableHead>
                                            <TableHead className="font-bold">Statut</TableHead>
                                            <TableHead className="font-bold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAppartementReservations.map((res) => (
                                            <TableRow key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <TableCell>
                                                    <div className="font-medium">{res.logement.nom}</div>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={res.user.image ?? undefined} />
                                                            <AvatarFallback>{res.user.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        {res.user.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <a href={`mailto:${res.user.email}`} className="text-blue-600 hover:underline">
                                                        {res.user.email}
                                                    </a>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{formatDate(typeof res.startDate === "string" ? res.startDate : res.startDate.toISOString())}</span>
                                                        <span className="text-xs text-gray-500">au</span>
                                                        <span className="text-sm">{formatDate(typeof res.endDate === "string" ? res.endDate : res.endDate.toISOString())}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <Badge variant="secondary">{res.nbpersonne}</Badge>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <span className="font-medium">
                                                        {res.paiement?.montant.toLocaleString()} GNF
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <code className="text-xs">{res.paiement?.transaction_reference}</code>
                                                </TableCell>
                                                <TableCell>
                                                    {res.status === 'CONFIRMED' ? (
                                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                            Confirmée
                                                        </Badge>
                                                    ) : res.status === 'PENDING' ? (
                                                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                            En attente
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                            Annulée
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            onClick={() => handleConfirmLogement(res.id, res.user.email, res.logement.id)} 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                                            disabled={loading || res.status === 'CONFIRMED'}
                                                        >
                                                            {loading ? "..." : "Confirmer"}
                                                        </Button>
                                                        <Button 
                                                            onClick={() => handleCancelLogement(res.id, res.user.email, res.logement.id)} 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                                            disabled={loading || res.status === 'CANCELLED'}
                                                        >
                                                            {loading ? "..." : "Annuler"}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
                <div className="mt-8">
                    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Revenu Total</span>
                                <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                                    {totalRevenue.toLocaleString()} GNF
                                </span>
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    );
}