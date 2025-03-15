
import { Calendar, Home,  Users, CreditCard, Warehouse } from "lucide-react"
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
import { usePathname } from "next/navigation"


const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Etablissements",
    url: "/",
    icon: Warehouse,
  },
 
  {
    title: "Réservations",
    url: "/",
    icon: Calendar,
  },
  {
    title: "Utilisateurs",
    url: "/",
    icon: Users,
  },
  {
    title: "Paiements",
    url: "/",
    icon: CreditCard,
  },
 
]

export function SideBarsClient() {

  const pathName = usePathname()

  return (
    <Sidebar>
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
