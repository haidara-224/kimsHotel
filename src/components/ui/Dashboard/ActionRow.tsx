"use client";
import { Edit, Trash } from "lucide-react";
import { Button } from "../button";
import Link from "next/link";
import { useTransition, useState, useCallback, useEffect } from "react";
import { DeleteChambre } from "@/app/(action)/Chambre.action"; 
import { toast } from "sonner";
import { RoleUserHotel } from "@/types/types";
import { getRolesUserHotelId } from "@/app/(action)/Roles.action";

interface PropsId {
  id: string;
  hotelId:string;
  userId?:string;
reload: () => void;
}

export function ActionRow({ id,hotelId,userId,reload }: PropsId) {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
const [isAdmin, setIsAdmin] = useState<RoleUserHotel | null>(null)
    const userIsAdminHotel = useCallback(async () => {
        try {
            const roleData = await getRolesUserHotelId(hotelId);
            setIsAdmin(roleData as unknown as RoleUserHotel)

        } catch (e) {
            console.log(e)
        }
    }, [hotelId])
    useEffect(() => {
        userIsAdminHotel()
    }, [userIsAdminHotel])
  const handleDelete = () => {
    setLoading(true);
    startTransition(async () => {
      const res = await DeleteChambre(id);
      setLoading(false);
      if (res.success) {
        toast(res.message); 
        reload()
      } else {
        alert(res.message); 
      }
    });
  };

  return (
    <div className="flex justify-end items-center flex-col lg:flex-row space-x-4">
    {
      isAdmin?.role.name==="ADMIN" &&
      <Button
      type="button"
      variant="destructive"
      onClick={handleDelete}
      disabled={isPending || loading}
    >
      <Trash className={loading ? "animate-spin" : ""} />
    </Button>
    }

      <Button type="button" variant="secondary" className="mt-8 lg:mt-0">
        <Link href={`/dashboard/hotes/${userId}/hotels/${hotelId}/chambres/${id}/edit`} className="bg-green-700 rounded text-white">
          <Edit />
        </Link>
      </Button>
    </div>
  );
}
