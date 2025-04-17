"use client";
import { Edit, Trash } from "lucide-react";
import { Button } from "../button";
import Link from "next/link";
import { useTransition, useState } from "react";
import { DeleteChambre } from "@/app/(action)/Chambre.action"; 
import { toast } from "sonner";

interface PropsId {
  id: string;
reload: () => void;
}

export function ActionRow({ id,reload }: PropsId) {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

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
      <Button
        type="button"
        variant="destructive"
        onClick={handleDelete}
        disabled={isPending || loading}
      >
        <Trash className={loading ? "animate-spin" : ""} />
      </Button>

      <Button type="button" variant="secondary" className="mt-8 lg:mt-0">
        <Link href={`${id}`} className="bg-green-700 rounded text-white">
          <Edit />
        </Link>
      </Button>
    </div>
  );
}
