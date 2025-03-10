import { Calendar, Home, Hotel, Users, CreditCard, Crown, Warehouse } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../sidebar"
import Link from "next/link"
import { usePathname, /*useSearchParams*/ } from "next/navigation"
//import { useCallback } from "react"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Logements",
    url: "/dashboard/logement",
    icon: Warehouse,
  },
  {
    title: "Hotels",
    url: "/dashboard/hotels",
    icon: Hotel,
  },
  {
    title: "Réservations",
    url: "/dashboard/reservations",
    icon: Calendar,
  },
  {
    title: "Utilisateurs",
    url: "/dashboard/utilisateurs",
    icon: Users,
  },
  {
    title: "Paiements",
    url: "/dashboard/paiements",
    icon: CreditCard,
  },
  {
    title: "Rôles & Permissions",
    url: "/dashboard/security",
    icon: Crown,
  }
]

export function SideBars() {
  //const searchParams = useSearchParams()
  //const search = searchParams.get("filter")
  const pathName = usePathname()
/*
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )
*/
  return (
    <Sidebar className="bg-red-500">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel><Link href="/">Kims</Link></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`${
                        pathName === item.url ? "bg-blue-500 dark:text-white" : "dark:text-white"
                      } flex items-center p-2 rounded-md`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
