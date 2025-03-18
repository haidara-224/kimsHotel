import { useState } from "react";
import { Star } from "lucide-react";
import { Textarea } from "../textarea";
import { Button } from "../button";

export default function AvisCommentLogement() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!rating) return alert("Veuillez donner une note.");
    if (!comment.trim()) return alert("Veuillez écrire un avis.");

    console.log("Note :", rating, "Commentaire :", comment);
    alert("Merci pour votre avis !");
    setRating(0);
    setComment("");
  };

  return (
    <div className="p-2 border rounded-lg mt-5">
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
            onClick={() => setRating(star)}
          />
        ))}
      </div>

   
      <Textarea
        placeholder="Partagez votre expérience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mb-3 h-[200px]"

      />

    
      <Button onClick={handleSubmit} className=" w-32">
        Envoyer l&apos;avis
      </Button>
    </div>
  );
}
