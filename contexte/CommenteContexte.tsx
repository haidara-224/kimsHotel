'use client';
import { UserComment } from '@/app/(action)/createAvisLogement';
import React, { createContext, useCallback, useContext, useState } from 'react';


interface Comment {
  id:string,
  comment: string;
  createdAt:Date;
  user: {
    id:string,
    name: string;

    profileImage:string | null;
    avis: {
      start: number;
    }[];
  } | null;

}

interface CommentContextType {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  fetchComments: (logementId: string) => Promise<void>;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const useCommentContext = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useCommentContext must be used within a CommentProvider');
  }
  return context;
};

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const fetchComments = useCallback(async (logementId: string) => {
    try {
      const data = await UserComment(logementId);
      setComments(data);
     
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires :", error);
    }
  },[])

  return (
    <CommentContext.Provider value={{ comments, setComments, fetchComments }}>
      {children}
    </CommentContext.Provider>
  );
};
