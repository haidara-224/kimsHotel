import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

import { prisma } from '@/src/lib/prisma';

import { getUser } from '@/src/lib/auth.session';


export async function POST(request: Request) {
  try {
     const user = await getUser();
     if (!user || !user.id) {
       return NextResponse.json(
         { error: "Utilisateur non authentifié" },
         { status: 401 }
       );
     }

    // 2. Récupération des données
    const formData = await request.formData();
    
    // Données textuelles
    const categoryLogementId = formData.get('categoryLogementId') as string;
    const options = JSON.parse(formData.get('options') as string);
    const nom = formData.get('nom') as string;
    const description = formData.get('description') as string;
    const adresse = formData.get('adresse') as string;
    const ville = formData.get('ville') as string;
    const telephone = formData.get('telephone') as string;
    const email = formData.get('email') as string;
    const capacity = parseInt(formData.get('capacity') as string);
    const hasClim = formData.get('hasClim') === 'true';
    const hasWifi = formData.get('hasWifi') === 'true';
    const hasTV = formData.get('hasTV') === 'true';
    const hasKitchen = formData.get('hasKitchen') === 'true';
    const parking = formData.get('parking') === 'true';
    const surface = parseInt(formData.get('surface') as string);
    const extraBed = formData.get('extraBed') === 'true';
    const nbChambres = parseInt(formData.get('nbChambres') as string);
    const price = parseFloat(formData.get('price') as string);
    

    // Fichiers images
    const imageFiles = formData.getAll('images') as File[];

    // 3. Validation
    if (!imageFiles || imageFiles.length < 4) {
      return NextResponse.json(
        { error: "Au moins 4 images sont requises" },
        { status: 400 }
      );
    }

    // 4. Vérification email existant
    const existingLogement = await prisma.logement.findFirst({
      where: { email },
      select: { id: true },
    });

    if (existingLogement) {
      return NextResponse.json(
        { error: "L'email est déjà utilisé" },
        { status: 400 }
      );
    }

    // 5. Création du logement
    const createdLogement = await prisma.logement.create({
      data: {
        userId: user.id as string,
        nom,
        description,
        adresse,
        ville,
        telephone,
        email,
        capacity,
        hasClim,
        hasWifi,
        hasTV,
        hasKitchen,
        parking,
        surface,
        extraBed,
        nbChambres,
        price,
        categoryLogementId,
      },
    });

    // 6. Upload des images
    const uploadResults = await Promise.allSettled(
      imageFiles.map(async (file) => {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const blob = await put(file.name, buffer, { access: 'public' });
          return { logementId: createdLogement.id, urlImage: blob.url };
        } catch (error) {
          console.error(`Erreur upload image ${file.name}:`, error);
          return null;
        }
      })
    );

    // 7. Sauvegarde des URLs des images
    const validImages = uploadResults
      .filter((result): result is PromiseFulfilledResult<{
        logementId: string;
        urlImage: string;
      }> => result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value);

    if (validImages.length > 0) {
      await prisma.imageLogement.createMany({
        data: validImages,
      });
    }

    // 8. Gestion des options
    if (options.length > 0) {
      await prisma.logementOptionOnLogement.createMany({
        data: options.map((optionId: unknown) => ({
          logementId: createdLogement.id,
          optionId,
        })),
      });
    }

    // 9. Gestion des rôles
    const clientRole = await prisma.role.findUnique({
      where: { name: "ADMIN" },
    });

    if (clientRole) {
      await prisma.userRoleAppartement.create({
        data: {
          userId: user.id.toString(),
          logementId: createdLogement.id,
          roleId: clientRole.id,
        },
      });
    }

    // 10. Vérification rôle HOTELIER
    const isHotelier = await prisma.userRole.findFirst({
      where: {
        userId: user.id.toString(),
        role: { name: 'HOTELIER' },
      },
    });

    if (!isHotelier) {
      const hotelierRole = await prisma.role.findUnique({
        where: { name: 'HOTELIER' },
      });

      if (hotelierRole) {
        await prisma.userRole.create({
          data: {
            userId: user.id.toString(),
            roleId: hotelierRole.id,
          },
        });
      }
    }

    return NextResponse.json(createdLogement, { status: 201 });

  } catch (error) {
    console.error('Erreur création logement:', error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}