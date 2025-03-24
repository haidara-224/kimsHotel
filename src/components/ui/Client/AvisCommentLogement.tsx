// AvisCommentLogement.tsx
"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Textarea } from "../textarea";
import { createAvis, createComment, getAvisByUser } from "@/app/(action)/createAvisLogement";
import { toast } from "sonner";
import { useCommentContext } from "@/contexte/CommenteContexte";
import { useUser } from "@clerk/nextjs";


export default function AvisCommentLogement({ logementId }: { logementId: string }) {
  const { setComments } = useCommentContext();  
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(false);
  const [isRatingPending, startRatingTransition] = useTransition();
  const [isCommentPending, startCommentTransition] = useTransition();
  const router = useRouter();
const {user}=useUser()
  useEffect(() => {
    async function fetchAvis() {
      const avis = await getAvisByUser(logementId);
      if (avis) {
        setRating(avis.start || 0);
      }
    }
    fetchAvis();
  }, [logementId]);

  const handleRatingSelect = (selectedRating: number) => {
    if (isCommentPending) return;
    setRating(selectedRating);

    startRatingTransition(async () => {
      const response = await createAvis(logementId, selectedRating);
      if (!response.success) {
        toast(response.message);
        if (response.message === "Utilisateur non connecté") {
          router.push(`/sign-in?redirect_url=views/appartement/${logementId}`);
        }
        return;
      }

      toast("Merci pour votre note !");
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return setError(true);
    if (isRatingPending) return;

    startCommentTransition(async () => {
      const response = await createComment(logementId, comment);
      if (!response.success) {
        toast(response.message);
        if (response.message === "Utilisateur non connecté") {
          router.push(`/sign-in?redirect_url=views/appartement/${logementId}`);
        }
        return;
      }

      toast("Merci pour votre avis !");
      setError(false);
      setComment("");

    
      setComments((prevComments) => [
        ...prevComments,
        {
          comment,
          user: {
            nom: user?.firstName || "", 
            prenom: user?.lastName || "",  
            avis: [{ start: rating }],
          },
        },
      ]);
    });
  };

  return (
    <div className="p-2 rounded-lg mt-5">
      <h2 className="text-lg font-semibold mb-3">Noter et Laisser votre avis</h2>
      <div className="flex gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-8 h-8 cursor-pointer transition-all ${
              (hover || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRatingSelect(star)}
          />
        ))}
      </div>

      <form onSubmit={handleCommentSubmit}>
        <Textarea
          placeholder="Partagez votre expérience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mb-3 h-[200px]"
        />
        <p className="text-red-600 text-xl"> {error ? 'Veuillez écrire un avis' : ''} </p>
        <button type="submit" className="w-32 bg-green-400 p-2 rounded-md text-white shadow-lg" disabled={isCommentPending}>
          {isCommentPending ? "Envoi..." : "Envoyer l'avis"}
        </button>
      </form>
    </div>
  );
}
