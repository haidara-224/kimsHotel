"use client";
import { useEffect } from "react";
import { Star } from "lucide-react";
import { useCommentContext } from "@/contexte/CommenteContexte";
import Image from "next/image";

interface PropsId {
  logmentId: string;
}

export function LogementComment({ logmentId }: PropsId) {
  const { comments, fetchComments } = useCommentContext(); // ✅ Garde cette version

  useEffect(() => {
    fetchComments(logmentId); 
  }, [logmentId]); 

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
                  src={comment.user?.profileImage || "/user_default.png"} 
                  alt="Photo de profil"
                  width={48}
                  height={48}
                  className="rounded-full object-cover border border-gray-300"
                />
                <div className="text-lg font-medium">
                  {comment.user?.prenom} {comment.user?.nom}
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

              <p className="text-gray-600">{comment.comment}</p>

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
