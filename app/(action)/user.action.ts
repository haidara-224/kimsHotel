'use server'

import { prisma } from "@/src/lib/prisma";

import { getUser } from "@/src/lib/auth.session";



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

export async function userHasRoles() {
  try {

     const user=await getUser()
    if (user) {

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
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

 const user=await getUser()
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

  const user=await getUser()
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
 const user=await getUser()

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
export async function DeleteUser()
{
  
   const user=await getUser()
  await prisma.user.delete({
    where: {
      id: user?.id
    }
  });
}