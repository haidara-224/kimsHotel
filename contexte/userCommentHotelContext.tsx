'use client';

import { UserCommentHotel } from '@/app/(action)/AvisHotel';
import React, { createContext, useContext, useState } from 'react';


interface Comment {
  comment: string;
  createdAt:Date;
  user: {
    nom: string;
    prenom: string;
    profileImage:string | null;
    avis: {
      start: number;
    }[];
  } | null;

}

interface CommentContextType {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  fetchComments: (hotelId: string) => Promise<void>;
}

const CommentContextHotel = createContext<CommentContextType | undefined>(undefined);

export const useCommentContext = () => {
  const context = useContext(CommentContextHotel);
  if (!context) {
    throw new Error('useCommentContext must be used within a CommentProvider');
  }
  return context;
};

export const CommentHotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const fetchComments = async (hotelId: string) => {
    try {
      const data = await UserCommentHotel(hotelId);
      setComments(data);
     
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires :", error);
    }
  };

  return (
    <CommentContextHotel.Provider value={{ comments, setComments, fetchComments }}>
      {children}
    </CommentContextHotel.Provider>
  );
};
