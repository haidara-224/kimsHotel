import * as z from "zod";

export const CreationSchemaHotel = z.object({
  option: z.array(z.string()).nonempty("Sélectionnez au moins une option."),

  numero_chambre: z.string().nonempty("Le numéro de chambre est requis."),
  nom: z.string()
    .min(3, "Le nom doit contenir au moins 3 caractères.")
    .max(100, "Le nom est trop long."),
  description: z.string()
    .min(10, "La description doit contenir au moins 10 caractères.")
    .max(15, "La description doit avoir au maximum 15 caractères."),
  adresse: z.string()
    .min(2, "L'adresse doit contenir au moins 2 caractères.")
    .max(200, "L'adresse est trop longue."),
  ville: z.string()
    .min(2, "La ville doit contenir au moins 2 caractères.")
    .max(100, "La ville est trop longue."),
  telephone: z.string()
    .regex(/^\+?\d{7,15}$/, "Le numéro de téléphone n'est pas valide."),
  email: z.string().email("L'adresse e-mail n'est pas valide."),

  images:  z.array(
    z.any().refine(file => file?.size < 10 * 1024 * 1024, {
      message: "Chaque image doit être inférieure à 5 Mo.",
    })
  ).min(4, "Ajoutez exactement 4 images.")
    .max(10, "Ajoutez exactement 10 images."),
    images_hotel: z.array(
      z.any().refine(file => file?.size < 10 * 1024 * 1024, {
        message: "Chaque image doit être inférieure à 5 Mo.",
      })
    ).min(4, "Ajoutez exactement 4 images.")
     .max(10, "Ajoutez exactement 10 images."),
    
 


  type_etoils: z.number().max(7, "Le nombre d'étoiles ne peut pas dépasser 7."),
  parking: z.boolean(),
  capacity: z.number()
    .min(1, "La capacité doit être d'au moins 1 personne.")
    .max(1000, "La capacité ne peut pas dépasser 1000 personnes.")
    .positive(),
  hasWifi: z.boolean(),
  hasTV: z.boolean(),
  hasClim: z.boolean(),
  hasKitchen: z.boolean(),
  price: z.number().min(100000, "Le prix ne peut pas être inférieur à 100000"),
  extraBed: z.boolean(),
  surface: z.number().min(9, "La surface ne peut pas être négative."),
  type_chambre: z.enum(['SIMPLE', 'DOUBLE', 'SUITE'], {
    errorMap: () => ({ message: 'Sélectionnez au moins un type de chambre' })
  })
});

