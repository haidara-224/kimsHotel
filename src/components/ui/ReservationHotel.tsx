"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { CalendarDays, DollarSign, Hotel, MapPin, Search, Filter, X, Home } from "lucide-react";
import { useSession } from "@/src/lib/auth-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Reservation } from "@/types/types";
import { getUserReservationsWithHotel, getUserReservationsWithLogement, UpdateStatusReservation } from "@/app/(action)/reservation.action";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { toast } from "sonner";

export default function ReservationHotel() {
  const { data: session, isPending } = useSession();
  const isUnauthenticated = !session && !isPending;
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationsL, setReservationsL] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"hotels" | "logements">("hotels");
  const router = useRouter();

  useEffect(() => {
    if (isUnauthenticated) {
      router.push("/auth/signin");
    }
  }, [isUnauthenticated, router]);

  const statusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-500/10 text-emerald-600";
      case "Pending":
        return "bg-amber-500/10 text-amber-600";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const [hotelReservations, logementReservations] = await Promise.all([
        getUserReservationsWithHotel(),
        getUserReservationsWithLogement(),
      ]);
      setReservations(hotelReservations as unknown as Reservation[]);
      setReservationsL(logementReservations as unknown as Reservation[]);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await UpdateStatusReservation(reservationId,"CANCELLED");
      toast.success("Reservation cancelled successfully");
      fetchReservations();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error("Failed to cancel reservation");
    }
  };

  const filteredReservations = (activeTab === "hotels" ? reservations : reservationsL)
    .filter(reservation => {
      const matchesSearch = activeTab === "hotels" 
        ? reservation.chambre?.hotel?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.chambre?.numero_chambre.toString().includes(searchTerm)
        : reservation.logement?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.logement?.adresse?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || reservation.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Mes Réservations</h1>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={activeTab === "hotels" ? "default" : "outline"} 
            onClick={() => setActiveTab("hotels")}
            className="flex items-center gap-2"
          >
            <Hotel className="w-4 h-4" />
            Hôtels
          </Button>
          <Button 
            variant={activeTab === "logements" ? "default" : "outline"} 
            onClick={() => setActiveTab("logements")}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Logements
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Rechercher ${activeTab === "hotels" ? "un hôtel ou numéro de chambre" : "un logement ou adresse"}`}
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <SelectValue placeholder="Filtrer par statut" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="PENDING"> En attente</SelectItem>
            <SelectItem value="CONFIRMED">Confirmé</SelectItem>
            <SelectItem value="CANCELLED">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredReservations.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {activeTab === "hotels" ? (
              <Hotel className="w-10 h-10 text-gray-400" />
            ) : (
              <Home className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <h2 className="text-xl font-semibold mb-2">Aucune réservation trouvée</h2>
          <p className="text-gray-500 max-w-md">
            {searchTerm || filterStatus !== "all" 
              ? "Aucune réservation ne correspond à vos critères de recherche."
              : `Vous n'avez pas encore fait de réservation dans cette catégorie.`}
          </p>
          {(searchTerm || filterStatus !== "all") && (
            <Button 
              variant="ghost" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Réinitialiser les filtres
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div 
          layout
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {filteredReservations.map((reservation) => (
              <motion.div
                key={reservation.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
                  <div className="relative">
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(reservation.status)}`}>
                        {reservation.status === "PENDING" && "En attente"}
{reservation.status === "CANCELLED" && "Annulée"}
{reservation.status === "CONFIRMED" && "Confirmée"}

                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold line-clamp-1">
                      {activeTab === "hotels" 
                        ? reservation.chambre?.hotel?.nom 
                        : reservation.logement?.nom}
                    </CardTitle>
                    <div className="text-sm text-gray-500">
                      {activeTab === "hotels" 
                        ? `Chambre #${reservation.chambre?.numero_chambre}`
                        : `Tél: ${reservation.logement?.telephone}`}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 flex-grow">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        {activeTab === "hotels" 
                          ? reservation.chambre?.hotel?.adresse 
                          : reservation.logement?.adresse}
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CalendarDays className="w-5 h-5 mt-0.5 text-gray-400 flex-shrink-0" />
                      <div className="text-sm text-gray-600">
                        <div>
                          {new Date(reservation.startDate).toLocaleDateString('fr-FR', { 
                            day: 'numeric',
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                        <div className="text-xs text-gray-400">au</div>
                        <div>
                          {new Date(reservation.endDate).toLocaleDateString('fr-FR', { 
                            day: 'numeric',
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 pt-2 border-t border-gray-100">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {reservation.paiement?.montant.toLocaleString('fr-FR')} GNF
                      </span>
                    </div>
                  </CardContent>
                  <div className="p-4 border-t">
                    {reservation.status !== "CANCELLED" && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleCancelReservation(reservation.id)}
                        disabled={reservation.status === "CANCELLED"}
                      >
                        Annuler la réservation
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}