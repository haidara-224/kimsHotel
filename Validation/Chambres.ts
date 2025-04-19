import * as z from "zod";

export const Chambreshema = z.object({
    numero_chambre: z.string()
        .nonempty('Le Numero de chambre est requis')
        .min(5, 'Le numero de chambre doit contenir au moins 5 caractères'),
    type_chambre: z.enum(['SIMPLE', 'DOUBLE', 'SUITE'], {
        errorMap: () => ({ message: 'Sélectionnez au moins un type de chambre' })
    }),
   
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
        images:z.array(
          z.instanceof(File).refine(file => file.size < 5 * 1024 * 1024, {
            message: "Chaque image doit être inférieure à 5 Mo.",
          })
        ).min(4, "Ajoutez au moins (4) images."), 

})



export const ChambreSchemaUpdate = z.object({
  numero_chambre: z
    .string()
    .nonempty('Le numéro de chambre est requis')
    .min(5, 'Le numéro de chambre doit contenir au moins 5 caractères'),
  type_chambre: z.enum(['SIMPLE', 'DOUBLE', 'SUITE',], {
    errorMap: () => ({ message: 'Sélectionnez un type de chambre' }),
  }),

  capacity: z
    .number()
    .min(1, "La capacité doit être d'au moins 1 personne.")
    .max(1000, "La capacité ne peut pas dépasser 1000 personnes."),

  hasWifi: z.boolean(),
  hasTV: z.boolean(),
  hasClim: z.boolean(),
  hasKitchen: z.boolean(),
  extraBed: z.boolean(),

  price: z
    .number()
    .min(100000, "Le prix ne peut pas être inférieur à 100000"),

  surface: z
    .number()
    .min(9, "La surface doit être au minimum de 9 m²"),


  images: z
    .array(
      z.instanceof(File).refine(file => file.size < 5 * 1024 * 1024, {
        message: "Chaque image doit être inférieure à 5 Mo.",
      })
    )
    .max(10, "Vous pouvez ajouter jusqu'à 10 images.")
    .optional(), 
});
