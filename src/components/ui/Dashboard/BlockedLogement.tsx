"use client";
import { useState } from "react";
import { Switch } from "../switch";
import { Lock, Unlock } from "lucide-react";

interface BlockedProps {
  id: string;
  initialBlocked: boolean;
  onToggle: (id: string, newStatus: boolean) => Promise<void>;
}

export function BlockedLogement({ id, initialBlocked, onToggle }: BlockedProps) {
  const [isBlocked, setIsBlocked] = useState(initialBlocked);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (newStatus: boolean) => {
    setLoading(true);
    try {
      await onToggle(id, newStatus); 
      setIsBlocked(newStatus);       
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isBlocked ? (
        <Lock className="text-red-500" size={20} />
      ) : (
        <Unlock className="text-green-500" size={20} />
      )}
      <Switch
        id={`switch-${id}`}
        checked={isBlocked}
        onCheckedChange={handleToggle}
        disabled={loading}
      />
    </div>
  );
}
