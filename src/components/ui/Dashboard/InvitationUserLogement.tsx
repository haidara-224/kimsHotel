"use client"

import { useState, useEffect } from "react"
import { Button } from "../button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog"
import { Input } from "../input"
import { Label } from "../label"
interface InvitationUserLogementDialogueProps {
  onSubmit: (email: string) => void
}
export function InvitationUserLogementDialogue({ onSubmit }: InvitationUserLogementDialogueProps) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

 
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }


  useEffect(() => {
    if (!email) {
      setMessage("")
      return
    }

    if (!validateEmail(email)) {
      setMessage("Veuillez entrer un email valide")
    } else {
      setMessage("")
    }
  }, [email])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
 
  
    if (!validateEmail(email)) {
      setMessage("Veuillez entrer un email valide")
      return
    }
    onSubmit(email)
    setIsSubmitted(true)
    setEmail("")
    setMessage("")

  }

  return (
   <Dialog>
     <DialogTrigger asChild>
       <Button variant="link">Inviter Un Utilisateur</Button>
     </DialogTrigger>
     
     <DialogContent className="sm:max-w-[425px]">
       <form onSubmit={handleSubmit}>
         <DialogHeader>
           <DialogTitle>Inviter Un Utilisateur</DialogTitle>
           <DialogDescription>Inviter un Hotelier</DialogDescription>
         </DialogHeader>
   
         <div className="grid gap-4 py-4">
           <div className="grid gap-2">
             <Label htmlFor="email">Email</Label>
             <Input
               id="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
             />
             {message && <p className="text-red-500 text-sm">{message}</p>}
             {isSubmitted && (
               <p className="text-green-500 text-sm">
                 L&apos;email a été envoyé avec succès
               </p>
             )}
           </div>
         </div>
   
         <DialogFooter>
           <Button type="submit" disabled={!!message || !email}>
             Inviter
           </Button>
         </DialogFooter>
       </form>
     </DialogContent>
   </Dialog>
  )
}
