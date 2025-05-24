'use client'

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { authClient } from "@/src/lib/auth-client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { toast } from "sonner"

function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ForgotPasswordContent />
        </Suspense>
    )
}


function ForgotPasswordContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams?.get("token")
    const [message, setIsmesage] = useState('')
    
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg space-y-4">
                <h1 className="text-2xl font-bold">Réinitialiser le mot de passe</h1>
                {children}
            </div>
        </div>
    )

    if (!token) {
        return (
            <Wrapper>
                <p className="text-muted-foreground">
                    Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
                </p>
                {
                    message.length > 0 && <p className="text-green-400 text-2xl">{message}</p>
                }
                <form
                    action={async (formData) => {
                        const email = formData.get('email')
                        await authClient.forgetPassword({
                            email: email as string,
                            redirectTo: "/auth/forgot-password",
                        },
                            {
                                onError(context) {
                                    toast.error(context.error.message)
                                },
                                onSuccess() {
                                    setIsmesage("Lien de réinitialisation envoyé à votre e-mail")
                                    toast.success("Lien de réinitialisation envoyé à votre e-mail")
                                },
                            })
                    }}
                    className="flex gap-2"
                >
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="votre.email@example.com"
                    />
                    <Button type="submit">Envoyer</Button>
                </form>
            </Wrapper>
        )
    }

    return (
        <Wrapper>
            <p className="text-muted-foreground">
                Entrez votre nouveau mot de passe ci-dessous.
            </p>
            <form
                action={async (formData) => {
                    const password = formData.get('password')
                    await authClient.resetPassword({
                        newPassword: password as string,
                        token: token as string,
                    }, {
                        onError: (ctx) => {
                            toast.error(ctx.error.message)
                        },
                        onSuccess() {
                            toast.success("Mot de passe réinitialisé avec succès")
                            router.push("/auth/signin")
                        },
                    })
                }}
                className="flex gap-2"
            >
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Nouveau mot de passe"
                />
                <Button type="submit">Confirmer</Button>
            </form>
        </Wrapper>
    )
}

export default ForgotPasswordPage