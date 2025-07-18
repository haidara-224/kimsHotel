
"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Textarea } from "../textarea";

import { toast } from "sonner";


import { createAvis, createComment, getAvisByUser } from "@/app/(action)/AvisHotel";
import { useCommentContext } from "@/contexte/userCommentHotelContext";
import { useSession } from "@/src/lib/auth-client";


export default function AvisCommentHotel({ hotelId }: { hotelId: string }) {
  const { setComments } = useCommentContext();  
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(false);
  const [isRatingPending, startRatingTransition] = useTransition();
  const [isCommentPending, startCommentTransition] = useTransition();
  const router = useRouter();
const { data: session } = useSession();
  useEffect(() => {
    async function fetchAvis() {
      const avis = await getAvisByUser(hotelId);
      if (avis) {
        setRating(avis.start || 0);
      }
    }
    fetchAvis();
  }, [hotelId]);

  const handleRatingSelect = (selectedRating: number) => {
    if (isCommentPending) return;
    setRating(selectedRating);

    startRatingTransition(async () => {
      const response = await createAvis(hotelId, selectedRating);
      if (!response.success) {
        toast(response.message);
        if (response.message === "Utilisateur non connecté") {
          router.push(`/auth/signin?redirect_url=views/hotel/${hotelId}`);
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
      const response = await createComment(hotelId, comment);
      if (!response.success) {
        toast(response.message);
        if (response.message === "Utilisateur non connecté") {
          router.push(`/auth/signin?redirect_url=views/hotel/${hotelId}`);
        }
        return;
      }

      toast("Merci pour votre avis !");
      setError(false);
      setComment("");

    
      setComments((prevComments) => [
        {
          id: crypto.randomUUID(), 
          comment,
          createdAt: new Date(), 
          user: {
            id: session?.user?.id || "", 
            name: session?.user?.name || "", 
           
            image: session?.user.image || null,
            avis: [{ start: rating }],
          },
        },
        ...prevComments, 
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
