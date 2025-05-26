import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function getCategoryLogement(name: string) {
  const category = await prisma.categoryLogement.findUnique({
    where: { name },
    select: { id: true },
  });

  return category ? category.id : null;
}

async function getCategoryHotel(name: string) {
  const category = await prisma.categoryLogement.findUnique({
    where: { name },
    select: { id: true },
  });

  return category ? category.id : null;
}

const generateUser = () => {
  const uuid = faker.string.uuid();
  return {
    id: uuid,

    name: faker.person.lastName(),
    email: faker.internet.email(),
    profileImage: faker.image.avatar(),
  
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};


const generateLogement = async (userId: string) => ({
  id: faker.string.uuid(),
  userId,
 
  nom: faker.company.name(),
  description: faker.lorem.paragraph(),
  adresse: faker.location.streetAddress(),
  ville: faker.location.city(),
  telephone: faker.phone.number(),
  email: faker.internet.email(),
  parking: faker.helpers.arrayElement([true, false]),
  capacity: faker.number.int({ min: 1, max: 10 }),
  disponible: faker.helpers.arrayElement([true, false]),
  hasWifi: faker.helpers.arrayElement([true, false]),
  hasTV: faker.helpers.arrayElement([true, false]),
  hasClim: faker.helpers.arrayElement([true, false]),
  hasKitchen: faker.helpers.arrayElement([true, false]),
  surface: faker.number.int({ min: 10, max: 100 }),
  extraBed: faker.helpers.arrayElement([true, false]),
  latitude: faker.location.latitude(),
  longitude: faker.location.longitude(),
  categoryLogementId: (await getCategoryLogement("Appartements")) ?? "default-category-id",
  note: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
  nbChambres: faker.number.int({ min: 1, max: 5 }),
  price: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});
const generateHotel = async (userId: string) => ({
  id: faker.string.uuid(),
  userId,
  nom: faker.company.name(),
  description: faker.lorem.paragraph(),
  adresse: faker.location.streetAddress(),
  ville: faker.location.city(),
  telephone: faker.phone.number(),
  email: faker.internet.email(),
  parking: faker.helpers.arrayElement([true, false]),
  latitude: faker.location.latitude(),
  longitude: faker.location.longitude(),
  etoils: faker.number.int({ min: 1, max: 5 }),
  categoryLogementId: (await getCategoryHotel("Hôtels")) ?? "default-category-id",
  note: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),

  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});
const generateAvisLogement = (userId: string, logementId: string) => ({
  id: faker.string.uuid(),
  userId,
  logementId,
  start: faker.number.int({ min: 1, max: 5 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});
const generateAvisHotel = (userId: string, hotelId: string) => ({
  id: faker.string.uuid(),
  userId,
  hotelId,
  start: faker.number.int({ min: 1, max: 5 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});


const generateReservationLogement = (userId: string, logementId: string) => ({
  id: faker.string.uuid(),
  startDate: faker.date.future(),
  endDate: faker.date.future(),
  status: faker.helpers.arrayElement(["PENDING", "CONFIRMED", "CANCELLED"]),
  nbpersonnes: faker.number.int({ min: 1, max: 10 }),
  userId,
  logementId,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});


async function main() {
  console.log("🔄 Début de l'insertion des données...");
  async function getCreateRole(){
    await prisma.role.createMany({
      data: [
        { name: 'CLIENT' },
        { name: 'HOTELIER' },
        { name: 'ADMIN' },
        { name: 'SUPER_ADMIN' }
      ],
      skipDuplicates: true
    });
    
  }

  // Création des catégories si elles n'existent pas

  await prisma.categoryLogement.upsert({
    where: { name: "Appartements" },
    update: {},
    create: {
      id: faker.string.uuid(),
      name: "Appartements",
      description: "Désigne les logements de type appartement, généralement indépendants et situés dans des immeubles résidentiels. Cette description sert à la classification interne et à la gestion des offres.",
      urlImage: "house.png",
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  });

  await prisma.categoryLogement.upsert({
    where: { name: "Hôtels" },
    update: {},
    create: {
      id: faker.string.uuid(),
      name: "Hôtels",
      description: ' Regroupe les établissements hôteliers, incluant les services d’hébergement et de restauration. Cette catégorisation interne facilite le suivi et le référencement dans le back-office coucou.',
      urlImage: "hotel.png",
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  });
  await getCreateRole()
  console.log('role creer')
  // Création des utilisateurs


  const users = Array.from({ length: 5 }, generateUser).map(user => ({
    ...user,
    emailVerified: false, // or set to true if you want
  }));
  await prisma.user.createMany({ data: users });
  console.log("✅ Utilisateurs insérés");

  // Création des logements
  const logements = await Promise.all(users.map(user => generateLogement(user.id)));
  const hotel = await Promise.all(users.map(user => generateHotel(user.id)));
  await prisma.logement.createMany({ data: logements });
  await prisma.hotel.createMany({ data: hotel });
  console.log("✅ Logements insérés et Hotel");

  // Création des avis
  const avis = logements.flatMap(logement =>
    users.map(user => generateAvisLogement(user.id, logement.id))
  );
  const avisHotel = hotel.flatMap(hotel =>
    users.map(user => generateAvisHotel(user.id, hotel.id))
  );

  await prisma.avis.createMany({ data: avis });
  await prisma.avis.createMany({ data: avisHotel });
  console.log("✅ Avis insérés");

  // Création des réservations
  const reservations = logements.flatMap(logement =>
    users.map(user => generateReservationLogement(user.id, logement.id))
  );

  console.log("✅ Réservations insérées");

  // Création des paiements
  
  console.log("✅ Réservations insérées");
  const reservationsIds = reservations.map(reservation => reservation.id);
  console.log("IDs des réservations : ", reservationsIds);
 
  const dataChambre = [];
  if (hotel.length > 0) {
    for (let i = 0; i < 10; i++) {
      dataChambre.push({
        id: faker.string.uuid(),
        numero_chambre:faker.string.uuid(),
        hotelId: hotel[0].id,
        description: faker.lorem.paragraph(),
        type: faker.helpers.arrayElement(["SIMPLE", "DOUBLE", "SUITE"]),
        price: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
        capacity: faker.number.int({ min: 1, max: 10 }),
        disponible: faker.helpers.arrayElement([true, false]),
        hasWifi: faker.helpers.arrayElement([true, false]),
        hasTV: faker.helpers.arrayElement([true, false]),
        hasClim: faker.helpers.arrayElement([true, false]),
        hasKitchen: faker.helpers.arrayElement([true, false]),
        surface: faker.number.int({ min: 10, max: 100 }),
        extraBed: faker.helpers.arrayElement([true, false]),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      });
    }
  } else {
    console.error("Aucun hôtel trouvé pour créer des chambres.");
  }
  await prisma.chambre.createMany({ data: dataChambre });


  console.log("✅ Réservations insérées");
  console.log("🎉 Données insérées avec succès !");

  await prisma.option.create({
    data: {
        name: "plage",
        description: "Cette propriété est proche de la plage.",
        title: "Plage",
        imageUrl:
            "https://a0.muscache.com/pictures/10ce1091-c854-40f3-a2fb-defc2995bcaf.jpg",

    }
})
await prisma.option.create({
    data: {
        name: "bordDeMer",
        description: "Cette propriété est proche du bord de mer.",
        title: "Bord de mer",
        imageUrl:
            "https://a0.muscache.com/pictures/bcd1adc0-5cee-4d7a-85ec-f6730b0f8d0c.jpg",

    }
})
await prisma.option.create({
    data: {
        name: "luxe",
        description: "Cette propriété est considérée comme luxueuse.",
        title: "Luxe",
        imageUrl:
            "https://a0.muscache.com/pictures/c8e2ed05-c666-47b6-99fc-4cb6edcde6b4.jpg",

    }
})
await prisma.option.create({
    data: {
        name: "vueIncroyable",
        description: "Cette propriété offre une vue incroyable.",
        title: "Vue incroyable",
        imageUrl:
            "https://a0.muscache.com/pictures/3b1eb541-46d9-4bef-abc4-c37d77e3c21b.jpg",

    }
})
await prisma.option.create({
    data: {
        name: "piscine",
        description: "Cette propriété possède une superbe piscine.",
        title: "Piscine",
        imageUrl:
            "https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg",

    }
})
await prisma.option.create({
    data: {
        name: "petiteMaison",
        description: "Cette propriété est considérée comme une petite maison.",
        title: "Petite maison",
        imageUrl:
            "https://a0.muscache.com/pictures/3271df99-f071-4ecf-9128-eb2d2b1f50f0.jpg",

    }
})
await prisma.option.create({
    data: {
        name: "campagne",
        description: "Cette propriété est située à la campagne.",
        title: "Campagne",
        imageUrl:
          "https://a0.muscache.com/pictures/6ad4bd95-f086-437d-97e3-14d12155ddfe.jpg",

    }
})
await prisma.option.create({
    data: {
        name: "incroyable",
        description: "Cette propriété a un effet wow.",
        title: "WOW !",
        imageUrl:
          "https://a0.muscache.com/pictures/c5a4f6fc-c92c-4ae8-87dd-57f1ff1b89a6.jpg",

    }
})



}
main()
  .catch(error => {
    console.error("❌ Erreur lors de l'insertion des données :", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });