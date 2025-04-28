'use server';
import { prisma } from "@/src/lib/prisma";
import { Hotel } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { del, put } from '@vercel/blob'
export async function createHotel(
    categoryLogementId: string,
    numero_chambre: string,
    option: string[],
    nom: string,
    description: string,
    adresse: string,
    ville: string,
    telephone: string,
    email: string,
    capacity: number,
    hasClim: boolean,
    hasWifi: boolean,
    hasTV: boolean,
    type_chambre: "SIMPLE" | "DOUBLE" | "SUITE",
    parking: boolean,
    surface: number,
    etoils: number,
    extraBed: boolean,
    price: number,
    images: File[],
    imagesHotel: File[]
) {
    try {
        const user = await currentUser();
        if (!user) throw new Error("Utilisateur non authentifié");

        const existingHotelsEmail = await prisma.hotel.findFirst({
            where: { email },
            select: { id: true },
          });
      
          if (existingHotelsEmail) return { error: "L'email est déjà utilisé" };

        const existingHotel = await prisma.hotel.findFirst({ where: { chambres: { some: { numero_chambre } } }, select: { id: true } });
        if (existingHotel) return { error: "Le numero est déjà utilisé" };


        const createdHotel = await prisma.hotel.create({
            data: { userId: user.id, nom, description, adresse, ville, etoils, telephone, email, parking, categoryLogementId }
        });
        if (createdHotel) {
            const clientRole = await prisma.role.findUnique({
                where: { name: "ADMIN" },
            });
            if (!clientRole) {
                throw new Error("Le rôle 'CLIENT' n'existe pas dans la base de données.");
            }
            await prisma.userRoleHotel.create({
                data: {
                    userId: user.id,
                    hotelId: createdHotel.id,
                    roleId: clientRole.id
                }
            })
        }
        const uploadedImagesHotel = await Promise.allSettled(
            imagesHotel.map(async (file) => {
                try {
                    const fileBuffer = Buffer.from(await file.arrayBuffer());
                    const blob = await put(file.name, fileBuffer, { access: 'public' });
                    return { hotelId: createdHotel.id, urlImage: blob.url };
                } catch (err) {
                    console.error("Erreur lors de l'upload d'une image :", err);
                    return null;
                }
            })
        );


        const validImagesHotel = uploadedImagesHotel.filter(result => result.status === "fulfilled" && result.value !== null)
            .map(result => (result as PromiseFulfilledResult<{ hotelId: string; urlImage: string }>).value);

        await prisma.imageHotel.createMany({ data: validImagesHotel });

        if (option.length > 0) {
            await prisma.hotelOptionOnHotel.createMany({
                data: option.map((optionId) => ({ hotelId: createdHotel.id, optionId }))
            });
        }


        const chambres = await prisma.chambre.create({
            data: { numero_chambre, hotelId: createdHotel.id, price, capacity, hasWifi, hasClim, hasTV, extraBed, surface, type: type_chambre }
        });

        const uploadedImages = await Promise.allSettled(
            images.map(async (file) => {
                try {
                    const fileBuffer = Buffer.from(await file.arrayBuffer());
                    const blob = await put(file.name, fileBuffer, { access: 'public' });
                    return { chambreId: chambres.id, urlImage: blob.url };
                } catch (err) {
                    console.error("Erreur lors de l'upload d'une image :", err);
                    return null;
                }
            })
        );

        const validImages = uploadedImages.filter(result => result.status === "fulfilled" && result.value !== null)
            .map(result => (result as PromiseFulfilledResult<{ chambreId: string; urlImage: string }>).value);

        await prisma.imageChambre.createMany({ data: validImages });


        const roleHotelier = await prisma.role.findUnique({ where: { name: "HOTELIER" }, select: { id: true } });
        if (!roleHotelier) throw new Error("Le rôle 'HOTELIER' n'existe pas dans la base de données.");

        const userHasRole = await prisma.userRole.findFirst({ where: { userId: user.id, roleId: roleHotelier.id } });
        if (!userHasRole) {
            await prisma.userRole.create({ data: { userId: user.id, roleId: roleHotelier.id } });
        }

        return createdHotel;

    } catch (error) {
        console.error("Erreur lors de la création du logement :", error);
        throw new Error(error instanceof Error ? error.message : "Une erreur inconnue est survenue");
    }
}

export async function getHotel() {
    try {
        const hotel = await prisma.hotel.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: true,
                categoryLogement: true

            },

        });


        return hotel;

    } catch (error) {
        console.error("Erreur lors de la récupération des hotels :", error);
        return null;
    }

}
export async function DeleteHotel(hotels: Hotel) {
    const hotelUnique = await prisma.hotel.findUnique({
        where: { id: hotels.id },
    });

    if (!hotelUnique) return null;
    try {
        await prisma.hotel.delete({
            where: {
                id: hotels.id
            }
        });
        return hotelUnique;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'hotel :", error);
        return null;
    }

}
export async function BlokedHotelAction(id: string) {

    const hotel = await prisma.hotel.findUnique({
        where: { id },
        select: { isBlocked: true }
    });

    if (!hotel) return null;


    const updatedHotel = await prisma.hotel.update({
        where: { id },
        data: { isBlocked: !hotel.isBlocked },
        select: { isBlocked: true }
    });




    return updatedHotel.isBlocked;
}

export async function getHotelById(id: string, calculateRate = false) {
    const hotel = await prisma.hotel.findUnique({
        where: { id },
        include: {
            user: true,
            categoryLogement: true,
            avis: true,
            favorites: true,
            chambres: {
                include: {
                    ...(calculateRate && {
                        reservations: {
                            where: { status: "CONFIRMED" },
                        },
                    }),
                },
            },

        },
    });

    if (!hotel) return null;

    if (calculateRate) {
        // Calcul du taux de réservation

        const confirmedReservationsCount = hotel.chambres.reduce(
            (acc, chambre) => acc + chambre.reservations.length,
            0
        );
        const reservationRate = hotel.chambres.length > 0 ? (confirmedReservationsCount / hotel.chambres.length) * 100 : 0;

        // Calcul du taux d'avis (par rapport au nombre d'avis dans l'ensemble du système)
        const totalAvis = await prisma.avis.count(); // Nombre total d'avis pour tous les logements
        const avisRate = totalAvis > 0 ? (hotel.avis.length / totalAvis) * 100 : 0;

        // Calcul du taux de favoris (par rapport au nombre total de favoris dans tous les logements)
        const totalFavoris = await prisma.favorite.count(); // Nombre total de favoris pour tous les logements
        const favorisRate = totalFavoris > 0 ? (hotel.favorites.length / totalFavoris) * 100 : 0;
        ;
        return { ...hotel, reservationRate, avisRate, favorisRate };
    }

    return hotel;
}

export async function RepportReservation(id: string) {
    const hotel = await prisma.hotel.findUnique({
        where: { id },
        include: {
            chambres: {
                include: {
                    reservations: {
                        select: {
                            status: true
                        }
                    }
                }
            }

        },
    });

    if (!hotel) return [];

    // Comptage des statuts de réservation
    const statuses: { PENDING: number; CONFIRMÉ: number; CANCELLED: number } = {
        PENDING: 0,
        CONFIRMÉ: 0,
        CANCELLED: 0,
    };
    hotel.chambres.forEach((chambre) => {
        chambre.reservations.forEach((reservation) => {
            if (reservation.status === "PENDING") statuses.PENDING++;
            if (reservation.status === "CONFIRMED") statuses.CONFIRMÉ++;
            if (reservation.status === "CANCELLED") statuses.CANCELLED++;
        });
    });


    // Préparer les données pour le graphique
    const chartData = Object.entries(statuses)
        .map(([status, count]) => ({
            reservation: status,
            visitors: count,
        }))
        .sort((a, b) => b.visitors - a.visitors);

    // Optionnel : si la somme totale des réservations est 0, renvoyer un tableau vide
    const totalVisitors = chartData.reduce((sum, item) => sum + item.visitors, 0);
    if (totalVisitors === 0) return [];

    return chartData;
}
export async function ReportReservationByMonth(hotelId: string) {
    // Récupère toutes les chambres appartenant à cet hôtel
    const chambres = await prisma.chambre.findMany({
        where: { hotelId: hotelId },
        select: { id: true }, // On ne récupère que l'ID des chambres
    });

    if (chambres.length === 0) {
        console.warn(`Aucune chambre trouvée pour l'hôtel avec l'ID ${hotelId}`);
        return Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            confirmed: 0,
            cancelled: 0,
        }));
    }

    // Récupère toutes les réservations associées aux chambres de l'hôtel
    const reservations = await prisma.reservation.findMany({
        where: {
            chambreId: { in: chambres.map(chambre => chambre.id) }, // Recherche pour toutes les chambres
            status: { in: ["CONFIRMED", "CANCELLED"] },
        },
        select: {
            status: true,
            createdAt: true,
        },
    });

    // Initialise un tableau avec 12 mois
    const months = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1, // Indexation 1-based pour la clarté
        confirmed: 0,
        cancelled: 0,
    }));

    // Parcours toutes les réservations et les classe par mois
    reservations.forEach((reservation) => {
        const monthIndex = new Date(reservation.createdAt).getMonth(); // 0 = janvier, 11 = décembre

        if (reservation.status === "CONFIRMED") {
            months[monthIndex].confirmed++; // Incrémente le bon mois
        } else if (reservation.status === "CANCELLED") {
            months[monthIndex].cancelled++;
        }
    });

    return months;
}
export async function getHotelsDetails(hotelId: string) {
    try {
        const hotel = await prisma.hotel.findUnique({
            where: { id: hotelId },
            include: {
                user: true,
                categoryLogement: true,
                hotelOptions: {
                    select: {
                        option: true,
                    },
                },
                avis: true,
                favorites: true,
                chambres: {
                    include: {
                        reservations: {
                            include: { user: true }
                        }
                    },
                },
            },
        });

        if (!hotel) return null;

        return hotel;
    } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'hotel :", error);
        return null;
    }




}
/*
interface Props{
    searchParams:{[key:string]:string | string[]| undefined}
}
const PAGE_SIZE=2
*/
export async function getDetailsHotel(hotel: string) {
    //const pagenum=searchParams.pagenum ?? 0
    try {
        const hotels = await prisma.hotel.findUnique({
            where: { id: hotel },
            include: {
                user: true,
                avis: true,
                favorites: true,
                images: true,
                hotelOptions: {
                    select: {
                        option: true,
                    },
                },
                chambres: {
                    include: {
                        images: true,

                    },


                }
            }
        })
        if (!hotels) return
        return hotels


    } catch (error) {
        console.error(error)
        throw new Error("Impossible d'afficher les détails de l'hotel")
    }
}
export async function getHotelWithUser() {
    const user_id = await currentUser()
    try {
        const hotel = await prisma.userRoleHotel.findMany({
            orderBy: { createdAt: "desc" },
            where: {
                userId: user_id?.id
            },
            include: {
         
                hotel:{
                    include:{
                        user:true
                    }
                },
                role:true

            },

        });

        
        return hotel;

    } catch (error) {
        console.error("Erreur lors de la récupération des hotels :", error);
        return null;
    }
}

export async function getChambreHotels(hotelId: string) {
    try {
        return await prisma.chambre.findMany({
            where: { hotelId },
            include: {
                images: true,
                reservations: {
                    where:{
                        status:"PENDING"
                    }
                }
            }
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des chambres :", error);
        throw new Error("Impossible de récupérer les chambres");
    }
}
export async function getShowHotel(id: string) {
    try {
      const hotel = await prisma.hotel.findUnique({
        where: { id },
        include: {
          hotelOptions: true,
          images: true,
        },
      });
  
      if (!hotel) {
        throw new Error("Aucun hôtel trouvé avec cet identifiant.");
      }
  
      return hotel;
    } catch (error) {
      throw new Error("Impossible de récupérer cet hôtel : " + error);
    }
  }
  
  export async function updateHotel(
    id: string,
    option: string[],
    nom: string,
    description: string,
    adresse: string,
    ville: string,
    telephone: string,
    email: string,
    parking: boolean,
    etoils: number,
    imagesHotel: File[]
  ) {
    try {
      const user = await currentUser();
      if (!user) throw new Error("Utilisateur non authentifié");
  
      const hotel = await prisma.hotel.findUnique({
        where: { id },
        include: { chambres: true }
      });
  
      if (!hotel) throw new Error("Hôtel non trouvé");
  
      const existingEmail = await prisma.hotel.findFirst({
        where: { email, NOT: { id } }
      });
      if (existingEmail) return { error: "L'email est déjà utilisé" };

      await prisma.hotelOptionOnHotel.deleteMany({ where: { hotelId: id } });
  
      if (imagesHotel.length > 0) {
        const oldImages = await prisma.imageHotel.findMany({ where: { hotelId: id } });
  
        await Promise.allSettled(
          oldImages.map(async (img) => {
            try {
              await del(img.urlImage);
            } catch (err) {
              console.error("Erreur suppression blob hôtel :", err);
            }
          })
        );
  
        await prisma.imageHotel.deleteMany({ where: { hotelId: id } });
  
        const uploadedImagesHotel = await Promise.allSettled(
          imagesHotel.map(async (file) => {
            try {
              const fileBuffer = Buffer.from(await file.arrayBuffer());
              const blob = await put(file.name, fileBuffer, { access: "public" });
              return { hotelId: id, urlImage: blob.url };
            } catch (err) {
              console.error("Erreur upload image hôtel :", err);
              return null;
            }
          })
        );
  
        const validImagesHotel = uploadedImagesHotel
          .filter((res) => res.status === "fulfilled" && res.value !== null)
          .map((res) => (res as PromiseFulfilledResult<{ hotelId: string; urlImage: string }>).value);
  
        if (validImagesHotel.length > 0) {
          await prisma.imageHotel.createMany({ data: validImagesHotel });
        }
      }
  
    
      await prisma.hotel.update({
        where: { id },
        data: { nom, description, adresse, ville, telephone, email, parking, etoils }
      });
  
    
      await prisma.hotelOptionOnHotel.deleteMany({ where: { hotelId: id } });

      if (option.length > 0) {
        await prisma.hotelOptionOnHotel.createMany({
          data: option.map((optionId) => ({ hotelId: id, optionId })),
        });
      }
  
      return { success: true, message: "Hôtel mis à jour avec succès" };
  
    } catch (error) {
      console.error("Erreur lors de la mise à jour du logement :", error);
      throw new Error(error instanceof Error ? error.message : "Une erreur inconnue est survenue");
    }
  }
  export async function getUsersWithHotel(hotelId:string) {
    try {
        const hotel=await prisma.userRoleHotel.findMany({
            where:{
                hotelId:hotelId
            },
            include:{
                user:true,
                role:true
            }
        })
        if(!hotel) return
        return hotel
    } catch (error) {
       console.log(error) 
    }
  }
  export async function UpdateStatusUserHotel(hotelId: string, userRoleHotelId: string) {
    try {
        const userRole = await prisma.userRoleHotel.findUnique({
            where: { id: userRoleHotelId },
        });
        
        console.log(userRole);
        if (!userRole || userRole.hotelId !== hotelId) {
            console.error("UserRoleHotel not found or hotelId mismatch");
            return;
        }

        const update = await prisma.userRoleHotel.update({
            where: { id: userRoleHotelId },
            data: { active: !userRole.active }, 
        });

        console.log("User status updated:", update);
        return update;
    } catch (error) {
        console.log(error);
    }
}
export async function userIsBloquedHotel(hotelId: string, userRoleHotelId: string) {
    try {
        const userRoleIsBloked = await prisma.userRoleHotel.findUnique({
            where: { id: userRoleHotelId },
        });
        if (!userRoleIsBloked || userRoleIsBloked.hotelId !== hotelId) {
            console.error("UserRoleHotel not found or hotelId mismatch");
            return null;
        }
        return userRoleIsBloked.active;
    } catch (error) {
        console.error("Erreur lors de la récupération des hôtels :", error);
        return null;
    }
}

  
  

