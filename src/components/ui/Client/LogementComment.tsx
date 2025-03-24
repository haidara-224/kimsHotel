
"use client";
import { useEffect } from "react";
import { Star } from "lucide-react";
import { useCommentContext } from "@/contexte/CommenteContexte";



interface PropsId {
  logmentId: string;
}

export function LogementComment({ logmentId }: PropsId) {
  const { comments } = useCommentContext(); 

  useEffect(() => {
    
  }, [logmentId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Derniers avis et commentaires</h1>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p>Aucun commentaire disponible.</p>
        ) : (
          comments.map((comment, index) => (
            <div key={index} className=" p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-3">
                <div className="text-lg font-medium">
                  {comment.user?.prenom} {comment.user?.nom}
                </div>
              </div>

              <div className="flex items-center mb-2">
                {comment.user?.avis?.[0]?.start ? (
                  <>
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`w-5 h-5 ${index < (comment.user?.avis[0]?.start ?? 0) ? 'fill-yellow-400' : 'fill-gray-300'}`}
                      />
                    ))}
                  </>
                ) : (
                  <span>Aucune note</span>
                )}
              </div>

              <p className="text-gray-600">{comment.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
