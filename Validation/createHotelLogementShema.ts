
import * as z from "zod";


export const CreationSchema = z.object({
    option: z.array(z.string()).nonempty("Sélectionnez au moins une option."),


    nom: z.string()
        .min(3, "Le nom doit contenir au moins 3 caractères.")
        .max(100, "Le nom est trop long."),

    description: z.string()
        .min(10, "La description doit contenir au moins 10 caractères.")
        .max(500, "La description est trop longue."),

    adresse: z.string()
        .min(5, "L'adresse doit contenir au moins 5 caractères.")
        .max(200, "L'adresse est trop longue."),

    ville: z.string()
        .min(2, "La ville doit contenir au moins 2 caractères.")
        .max(100, "La ville est trop longue."),

    telephone: z.string()
        .regex(/^\+?\d{7,15}$/, "Le numéro de téléphone n'est pas valide."),

    email: z.string()
        .email("L'adresse e-mail n'est pas valide."),

    capacity: z.number()
        .min(1, "La capacité doit être d'au moins 1 personne.")
        .max(1000, "La capacité ne peut pas dépasser 1000 personnes.").positive(),

    hasWifi: z.boolean(),
    hasTV: z.boolean(),
    hasClim: z.boolean(),
    hasKitchen: z.boolean(),
    parking: z.boolean(),
    extraBed: z.boolean(),

    surface: z.number()
        .min(1, "La surface ne peut pas être négative."),

    nbChambres: z.number()
        .min(1, "Il doit y avoir au moins 1 chambre.")
        .max(10, "Il ne peut pas y avoir plus de 50 chambres."),

    price: z.number()
        .min(100, "Le prix ne peut pas être négatif.")
        
});
