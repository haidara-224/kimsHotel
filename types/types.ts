
// Enums
export enum Roles {
  CLIENT = "CLIENT",
  HOTELIER = "HOTELIER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

export enum TypeChambre {
  SIMPLE = "SIMPLE",
  DOUBLE = "DOUBLE",
  SUITE = "SUITE",
  APPARTEMENT = "APPARTEMENT",
}

export enum StatutReservations {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export enum StatutPaiements {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export enum TypePaiement {
  ORANGE_MONEY = "ORANGE_MONEY",
  WAVE = "WAVE",
  PAYPAL = "PAYPAL",
  STRIPE = "STRIPE",
}

// Interfaces

// Role et gestion de la relation Many-to-Many via UserRole
export interface Role {
  id: string;
  name: Roles;
  createdAt: Date;
  updatedAt: Date;
}
export interface CommentaireLogement{
  id:string;
  logementId:string;
  logement:Logement[]
  userId:string;
  user:User[]
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  prenom: string;
  nom: string;
  clerkUserId: string;
  email: string;
  roles?: Role[]
  commentUser: CommentaireLogement[]
  profileImage?: string | null;
  telephone?: string | null
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageLogement{
  id:string,
  logementId:string,
  urlImage:string,
  createdAt: Date;
  updatedAt: Date;
}
export interface UserRole {
  userId: string;
  roleId: string;
  user: User;
  role: Role;
}

export interface Favorite {
  id: string;
  userId: string | null;
  logementId: string | null;
  createdAt: Date;
  updatedAt: Date;

}

export interface Avis {
  id: string;
  start: number;
  user?: User;
  logement?: Logement;
  userId?: string;
  logementId?: string;
  hotetId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Catégorie de logement
export interface CategoryLogement {
  id: string;
  name: string;
  description?: string | null;
  urlImage: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CategoryLogementWithOther {
  id: string;
  name: string;
  description?: string;
  urlImage: string;
  createdAt: Date;
  updatedAt: Date;
}

// Option de logement et la table de jointure correspondante
export interface LogementOption {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogementOptionOnLogement {
  logementId: string;
  logement: Logement;
  optionId: string;
  option: LogementOption;
}
export interface HotelOptionOnHotel {
  hotelId: string;
  hotel: Logement;
  optionId: string;
  option: LogementOption;

}

// Logement principal
export interface Logement {
  id: string;
  userId: string;
  user: User;
  categoryLogementId: string;
  categoryLogement: CategoryLogement;
  nom: string;
  description?: string | null;
  adresse?: string | null;
  ville?: string | null;
  telephone?: string | null;
  email?: string | null;
  capacity: number;
  disponible: boolean;
  hasWifi: boolean;
  hasTV: boolean;
  hasClim: boolean;
  hasKitchen: boolean;
  parking: boolean;
  surface?: number | null;
  extraBed: boolean;
  isBlocked: boolean;
  latitude?: number;
  longitude?: number;
  note?: number;
  favorites: Favorite[] | null,
  reservations: Reservations[] | null,
  avis: [] | null,
  logementOptions: {
    logementId: string;
    optionId: string;
    option: LogementOption;
  }[];
  commentLogement:CommentaireLogement[]
images:ImageLogement[]
  nbChambres: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface Hotel {
  id: string;
  userId: string;
  user: User
  categoryLogementId: string;
  categoryLogement: CategoryLogement;
  nom: string;
  hotelOptions: HotelOptionOnHotel[]
  description?: string | null;
  adresse?: string | null;
  ville?: string | null;
  telephone?: string | null;
  email?: string | null;
  parking: boolean;
  chambres: { 
    Chambres:Chambre[]
    reservations: Reservation[] 
  }[];
  avis: Avis[];
  favorites: Favorite[];
  isBlocked: boolean;
  latitude?: number;
  longitude?: number;
  note?: number;
  images:ImageHotel[]
  etoils?: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface Hotele {
  id: string;
  userId: string;
  user: User
  categoryLogementId: string;
  categoryLogement: CategoryLogement;
  nom: string;
  hotelOptions: HotelOptionOnHotel[]
  description?: string | null;
  adresse?: string | null;
  ville?: string | null;
  telephone?: string | null;
  email?: string | null;
  parking: boolean;
  chambres:Chambre[];
   

  avis: Avis[];
  favorites: Favorite[];
  isBlocked: boolean;
  latitude?: number;
  longitude?: number;
  note?: number;
  images:ImageHotel[]
  etoils?: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface ImageHotel {
  id : string;
  hotel:     Hotel[] ;
  hotelId:   string;
  urlImage:  string;
  createdAt: Date;
  updatedAt: Date;
}
 export interface Hotels {
  id: string;
  userId: string;
  user: User
  categoryLogementId: string;
  categoryLogement: CategoryLogement;
  nom: string;
  description?: string | null;
  adresse?: string | null;
  ville?: string | null;
  telephone?: string | null;
  email?: string | null;
  parking: boolean;
  reservationRate: number;
  avisRate: number;
  favorisRate: number;
  chambres: { reservations: Reservations[] }[];
  avis: { id: string; comment: string }[];
  favorites: { id: string; userId: string }[];
  isBlocked: boolean;
  latitude?: number | null;
  longitude?: number | null;
  note?: number | null;
  etoils?: number;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
}

export interface Logements {
  id: string;
  userId: string;
  user: User;
  categoryLogement: CategoryLogement;
  categoryLogementId: string;
  nom: string;
  description?: string | null;
  adresse?: string | null;
  ville?: string | null;
  telephone?: string | null;
  email?: string | null;
  parking: boolean;
  isBlocked: boolean;
  latitude?: number;
  longitude?: number;
  note?: number;
  etoils?: number;

  createdAt: Date;
  updatedAt: Date;
}


// Réservation
export interface Reservation {
  id: string;
  startDate: Date;
  endDate: Date;
  status: string;
  userId?: string | null;
  user: User;
  logement: Logement;
  chambre: { hotel: Hotel };
  logementId?: string | null;
  chambreId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface Reservations {
  id: string;
  startDate: Date;
  endDate: Date;
  status: string;
  user: User,
  logement: Logement

  userId?: string | null;
  logementId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}


// Paiement lié à une réservation
export interface Paiement {
  id: string;
  reservationId: string;
  montant: number;
  status: StatutPaiements;
  type: TypePaiement;
  createdAt: Date;
  updatedAt: Date;
}

// Chambre d'un logement
export interface Chambre {
  id: string;
  hotelId: string;
  numero_chambre:string;
  description?: string | null;
  type: TypeChambre;
  price: number;
  capacity: number;
  disponible: boolean;
  hasWifi: boolean;
  hasTV: boolean;
  hasClim: boolean;
  hasKitchen: boolean;
  surface?: number | null;
  extraBed: boolean;
  images?: ImageChambre[] | null;
  createdAt: Date;
  updatedAt: Date;
}

// Image associée à un logement
export interface ImageLogement {
  id: string;
  logementId: string;
  urlImage: string;
  createdAt: Date;
  updatedAt: Date;
}

// Image associée à une chambre
export interface ImageChambre {
  id: string;
  chambreId: string;
  urlImage: string;
  createdAt: Date;
  updatedAt: Date;
}

//logement with Relation ship
export interface LogementWithRealtion {
  id: string;
  userId: string;
  user: User;
  categoryLogement: CategoryLogement;
  categoryLogementId: string;
  nom: string;
  favorites: Favorite[] | null,
  chambres: Chambre[] | null,
  reservations: [] | null,
  avis: [] | null,
  logementOptions: {
    logementId: string;
    optionId: string;
    option: LogementOption;
  }[];

  description?: string | null;
  adresse?: string | null;
  ville?: string | null;
  telephone?: string | null;
  email?: string | null;
  parking: boolean;
  isBlocked: boolean;
  latitude?: number;
  longitude?: number;
  note?: number;
  etoils?: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface homeTypes {
  id: string;
  adresse: string;
  categoryLogementId: string;
  categoryLogement: CategoryLogement;
  description: string;
  email: string;
  etoils: number | null;
  images: ImageLogement[],

  hotelOptions: {
    hotelId?: string | null;
    logementId?: string | null;
    option: LogementOption;
    optionId: string;
  }[];
  chambres:Chambre[]
  price:number;
  isBlocked: boolean;
  latitude: string;
  longitude: string;
  nom: string;
  note: number;
  parking: boolean;
  telephone: boolean;
  type: string;
  userId: string;
  ville: string;
  createdAt: Date;
  updatedAt: Date;
}
