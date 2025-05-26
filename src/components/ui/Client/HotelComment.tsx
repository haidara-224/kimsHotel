"use client";
import { useEffect, useState, useTransition } from "react";
import { Star, Trash } from "lucide-react";

import Image from "next/image";
import { useCommentContext } from "@/contexte/userCommentHotelContext";

import { DeleteCommentUser } from "@/app/(action)/AvisHotel";
import { toast } from "sonner";
import { useSession } from "@/src/lib/auth-client";


interface PropsId {
  hotelId: string;
}

export function HotelComment({ hotelId }: PropsId) {
  const { comments, fetchComments,setComments } = useCommentContext(); 
  const [isPending, startTransition] = useTransition();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data: session} = useSession();
  useEffect(() => {
    fetchComments(hotelId); 
  }, [hotelId,fetchComments]); 
  const handleDelete = (id: string) => {
     setDeletingId(id);
     startTransition(async () => {
       
       setComments((prev) => prev.filter((comment) => comment.id !== id));
       await DeleteCommentUser(id);
       setDeletingId(null);
       toast("Commentaire supprimé avec succès !");
     });
   };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Derniers avis et commentaires</h1>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p>Aucun commentaire disponible.</p>
        ) : (
          comments.map((comment, index) => (
            <div key={index} className="p-4 rounded-lg">
              <div className="flex items-center mb-3 space-x-3">
                <Image
                  src={comment.user?.image || "/user_default.png"} 
                  alt="Photo de profil"
                  width={48}
                  height={48}
                  className="rounded-full object-cover border border-gray-300"
                />
                <div className="text-lg font-medium">
                  {comment.user?.name} 
                </div>
              </div>

              <div className="flex items-center mb-2">
                {comment.user?.avis?.length ? (
                  <>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < (comment.user?.avis[0]?.start ?? 0) ? 'fill-yellow-400' : 'fill-gray-300'}`}
                      />
                    ))}
                  </>
                ) : (
                  <span>Aucune note</span>
                )}
              </div>

            <div className="flex">
                <span className="text-gray-600">{comment.comment}</span>
                {session?.user?.id === comment.user?.id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    disabled={isPending}
                    className="text-sm text-red-400 hover:text-red-800 hover:transition-all flex items-center"
                  >
                    {deletingId === comment.id ? (
                      <div className="w-5 h-5 border-2 border-gray-200 border-t-transparent rounded-full animate-spin mx-5" />
                    ) : (
                      <Trash className="mx-5" />
                    )}
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
