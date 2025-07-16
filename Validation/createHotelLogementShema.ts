
import * as z from "zod";


export const CreationSchema = z.object({
    option: z.array(z.string()).nonempty("Sélectionnez au moins une option."),


    nom: z.string()
        .min(3, "Le nom doit contenir au moins 3 caractères.")
        .max(100, "Le nom est trop long."),

    description: z.string()
        .min(10, "La description doit contenir au moins 10 caractères.")
        .max(100, "La description doit avoir au maximum 100 caractères."),

    adresse: z.string()
        .min(2, "L'adresse doit contenir au moins 2 caractères.")
        .max(200, "L'adresse est trop longue."),

    ville: z.string()
        .min(2, "La ville doit contenir au moins 2 caractères.")
        .max(100, "La ville est trop longue."),

    telephone: z.string()
        .regex(/^\+?\d{7,15}$/, "Le numéro de téléphone n'est pas valide."),

    email: z.string()
        .email("L'adresse e-mail n'est pas valide."),

    capacity: z.number()
        .min(1, "La capacité doit être d'au moins 1 personne."),


    hasWifi: z.boolean(),
    hasTV: z.boolean(),
    hasClim: z.boolean(),
    hasKitchen: z.boolean(),
    parking: z.boolean(),
    extraBed: z.boolean(),

    surface: z.number()
        .min(9, "La surface ne peut pas être inferieur a 9."),

    nbChambres: z.number()
        .min(1, "Il doit y avoir au moins 1 chambre.")
        .max(10, "Il ne peut pas y avoir plus de 10 chambres."),

    price: z.number()
        .min(100000, "Le prix ne peut pas être inférieur a 100000"),
    images: z.array(
        z.any().refine(file => file?.size < 10 * 1024 * 1024, {
            message: "Chaque image doit être inférieure à 5 Mo.",
        })
    ).min(4, "Ajoutez exactement 4 images.")
        .max(10, "Ajoutez exactement 10 images."),

});
export const EditSchemaLogement = z.object({
    option: z.array(z.string()).nonempty("Sélectionnez au moins une option."),


    nom: z.string()
        .min(3, "Le nom doit contenir au moins 3 caractères.")
        .max(100, "Le nom est trop long."),

    description: z.string()
        .min(10, "La description doit contenir au moins 10 caractères.")
        .max(100, "La description doit avoir au maximum 100 caractères."),

    adresse: z.string()
        .min(2, "L'adresse doit contenir au moins 2 caractères.")
        .max(200, "L'adresse est trop longue."),

    ville: z.string()
        .min(2, "La ville doit contenir au moins 2 caractères.")
        .max(100, "La ville est trop longue."),

    telephone: z.string()
        .regex(/^\+?\d{7,15}$/, "Le numéro de téléphone n'est pas valide."),

    email: z.string()
        .email("L'adresse e-mail n'est pas valide."),

    capacity: z.number()
        .min(1, "La capacité doit être d'au moins 1 personne."),


    hasWifi: z.boolean(),
    hasTV: z.boolean(),
    hasClim: z.boolean(),
    hasKitchen: z.boolean(),
    parking: z.boolean(),
    extraBed: z.boolean(),

    surface: z.number()
        .min(9, "La surface ne peut pas être inferieur a 9."),

    nbChambres: z.number()
        .min(1, "Il doit y avoir au moins 1 chambre.")
        .max(10, "Il ne peut pas y avoir plus de 10 chambres."),

    price: z.number()
        .min(100000, "Le prix ne peut pas être inférieur a 100000"),
images: z.array(
  z.any().refine(file => {

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const maxSize = isMobile ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    return file?.size <= maxSize;
  }, {
    message: "Chaque image doit être inférieure à 5 Mo (10 Mo sur mobile).",
  })
).min(4, "Ajoutez au moins 4 images.")
.max(10, "Ajoutez au maximum 10 images."),

});
