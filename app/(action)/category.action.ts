'use server'

import { prisma } from "@/src/lib/prisma"

import { revalidatePath } from "next/cache"

export async function getCategory() {
  const category = await prisma.categoryLogement.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
  return category
}

export async function UpdateCategory(id: string, name: string, description: string) {
  const category = await prisma.categoryLogement.findUnique({
    where: { id },
  });

  if (!category) return null;

  const update = await prisma.categoryLogement.update({
    where: {
      id
    },
    data: {
      name: name,
      description: description
    }
  })

  revalidatePath("/dashboard");

  return update
}

export async function DeleteCategory(id: string) {
  try {
    const deleteCategori = await prisma.categoryLogement.delete({
        where: { id: id }
    })
    if (!deleteCategori) {
        throw new Error("Erreur lors de la suppression de la Catégories.");
    }
} catch (error) {
    console.error(error)
}
}

