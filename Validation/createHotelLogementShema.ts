import * as z from "zod";

import { prisma } from "@/src/lib/prisma";
async function findValidOptions(ids: string[]) {
    const options = await prisma.option.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
  
    const validIds = options.map((opt) => opt.id);
    return ids.every((id) => validIds.includes(id));
  }
  async function findCategoryLogement(id:string){
    const types=await prisma.categoryLogement.findFirst({
        where:{
            id
        }
    })
    return !!types;
  }
export const CreationShema = z.object({
    type_Etablissement:z.string().refine(async (id) => {
        if (!id) return false;
        return await findCategoryLogement(id);
      }, {
        message: "Le type d'tablissement n'est pas valide."
      }), 
    option: z.array(z.string()).min(1, "Sélectionnez au moins une option").refine(async (ids) => {
        if (!ids || ids.length === 0) return false;
        return await findValidOptions(ids);
      }, {
        message: "Une ou plusieurs options sélectionnées ne sont pas valides.",
      }),
});