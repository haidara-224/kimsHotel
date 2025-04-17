
"use client";
import { Switch } from "../switch";
import { Label } from "../label";
import { useState } from "react";
import { toggleDisponibilite } from "@/app/(action)/Chambre.action";
import { toast } from "sonner";

type Props = {
  id: string ;
  initialValue: boolean;
};

export default function ToggleDisponibiliteCell({ id, initialValue }: Props) {
  const [checked, setChecked] = useState(initialValue);
  const [submitting,setSubmitting]=useState(false)

  const handleToggle = async (checked: boolean) => {
    setSubmitting(true); 
    setChecked(checked);
    try {
      await toggleDisponibilite(id);
      toast("Disponibilité mis a jours avec success")
    } catch (error) {
      setChecked(!checked);
     
      console.log('error: ' + error);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`dispo-${id}`}
        checked={checked}
        disabled={submitting}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor={`dispo-${id}`}>
        {checked ? "Disponible" : "Indisponible"}
      </Label>
    </div>
  );
}
