'use server'

import { prisma } from "@/src/lib/prisma";

import { currentUser } from "@clerk/nextjs/server";

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
    const formattedUsers = users.map((user) => ({
      ...user,
      roles: user.roles.map((userRole) => userRole.role),
    }));

    console.log(formattedUsers);
    return formattedUsers;
  } catch (error) {
    console.log(error);
    return [];
  }
}


export async function CreateAddUser() {
  const user = await currentUser()
if(!user){
  return null
}
  const existingUser = await prisma.user.findUnique({
    where: {
      clerkUserId: user?.id
    }
  });

  if(existingUser){
   // console.log(existingUser)
    return existingUser
  }
  if (!existingUser && user?.firstName) {
    const createUser = await prisma.user.create({
      data: {
        id: user?.id || "Inconnu",
        clerkUserId:user?.id,
        prenom: user?.lastName || "Inconnu",
        nom: user?.firstName || "Inconnu",
        email: user?.primaryEmailAddress?.emailAddress || "Inconnu",
        profileImage: user?.imageUrl,
        telephone: user?.primaryPhoneNumber?.phoneNumber


      },
      include: { roles: true }, 

    })
    if (createUser?.roles.length === 0) {
      // Trouver le rôle CLIENT
      let clientRole = await prisma.role.findUnique({
        where: { name: "CLIENT" },
      });

   
      if (!clientRole) {
        clientRole = await prisma.role.create({
          data: { name: "CLIENT" },
        });
      }
    
      await prisma.userRole.create({
        data: {
          userId: createUser.clerkUserId,
          roleId: clientRole.id,
        },
      });
    }
    return createUser
  }

}

export async function userHasRoles() {
  try {

    const user = await currentUser()
    if (user) {

      const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: user.id },
        select: {
          id: true,
          roles: {
            select: {
              role: {
                select: { name: true }
              }
            }
          }
        }
      });

      if (dbUser) {
       
        const formattedUser = {
          id: dbUser.id,
          roles: dbUser.roles.map(r => r.role.name)
        };

        return formattedUser;
      }
    }
  } catch (e) {
    console.error(e);
  }
}
export async function userIsAdmin(): Promise<boolean> {

  const user = await currentUser();
  if (!user) return false;


  const userRole = await prisma.userRole.findFirst({
    where: {
      userId: user.id,
      role: {
        name: 'ADMIN'
      }
    },
    select: {
      role: {
        select: { name: true }
      }
    }
  });

  return Boolean(userRole);
}
export async function userIsSuperAdmin(): Promise<boolean> {

  const user = await currentUser();
  if (!user) return false;


  const userRole = await prisma.userRole.findFirst({
    where: {
      userId: user.id,
      role: {
        name:'SUPER_ADMIN'
      }
    },
    select: {
      role: {
        select: { name: true }
      }
    }
  });

  return Boolean(userRole);
}
export async function userIsHotelier(): Promise<boolean> {

  const user = await currentUser();
  if (!user) return false;


  const userRole = await prisma.userRole.findFirst({
    where: {
      userId: user.id,
      role: {
        name:'HOTELIER'
      }
    },
    select: {
      role: {
        select: { name: true }
      }
    }
  });

  return Boolean(userRole);
}
export async function deletedUser(id: string) {
  try {
    await prisma.user.delete({
      where: {
        id: id
      }
    });
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}