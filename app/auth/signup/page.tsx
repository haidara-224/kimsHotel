"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUp, useSession } from "@/src/lib/auth-client";
import Link from "next/link";

export default function SignUp() {
	const [name, setName] = useState("");
	
	const [email, setEmail] = useState("");

	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [serveurError, setServeurError] = useState<{ [key: string]: string }>({})
const { data: session } = useSession();
  

  const isAuthenticated = !!session;

  useEffect(()=>{
	if(isAuthenticated){
		return router.push('/')
	}
  },[isAuthenticated,router])
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const validate = () => {
		const newErrors: { [key: string]: string } = {};

		if (!name.trim()) newErrors.name = "Le nom est obligatoire";
	
		if (!password) newErrors.password = "Le mot de passe est obligatoire";
		if (password !== passwordConfirmation)
			newErrors.passwordConfirmation = "Les mots de passe ne correspondent pas";

		setErrors(newErrors);

		// Retourne true si pas d'erreur
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate()) return;

		setLoading(true);

		try {
			await signUp.email({
				email,
				password,
				name: name.trim(),
				image: image ? await convertImageToBase64(image) : "",
				
				callbackURL: "/dashboard",
				fetchOptions: {
					onResponse: () => {
						setLoading(false);
					},
					onRequest: () => {
						setLoading(true);
					},
					onError: (ctx) => {
						toast.error(ctx.error.message);
						setServeurError({ message: ctx.error.message });
						setLoading(false);
					},
					onSuccess: async () => {
						router.push("/");
					},
				},
			});
		} catch (error) {
			setLoading(false);
			console.log(error)
			toast.error("Une erreur est survenue lors de l'inscription.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
			<Card className="w-full max-w-md shadow-xl border-none rounded-2xl bg-white">
				<CardHeader>
					<CardTitle className="text-lg md:text-xl flex items-center justify-center">
						<Image
							src="/logoSimple.png"
							width={100}
							height={100}
							alt="Kims Hotel"
							className="w-20 h-auto transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3"
						/>
					</CardTitle>
					<CardDescription className="text-xs md:text-sm">Entrez vos informations pour créer un compte.</CardDescription>
				</CardHeader>
				<CardContent>
					{serveurError && serveurError.message && (
						<p className="text-red-600 text-sm">{serveurError.message}</p>
					)}
					<div className="grid gap-2">
						
							<div className="grid gap-2">
								<Label htmlFor="first-name">Nom</Label>
								<Input
									id="first-name"
									placeholder="Haidara"
									onChange={(e) => setName(e.target.value)}
									value={name}
								/>
								{errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
							</div>
							
					
					
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								onChange={(e) => setEmail(e.target.value)}
								value={email}
							/>
							{errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Mot de passe</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="new-password"
								placeholder="Mot de passe"
							/>
							{errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
							<Input
								id="password_confirmation"
								type="password"
								value={passwordConfirmation}
								onChange={(e) => setPasswordConfirmation(e.target.value)}
								autoComplete="new-password"
								placeholder="Confirmer le mot de passe"
							/>
							{errors.passwordConfirmation && (
								<p className="text-red-600 text-sm">{errors.passwordConfirmation}</p>
							)}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="image">Image de profil (optionnelle)</Label>
							<div className="flex items-end gap-4">
								{imagePreview && (
									<div className="relative w-16 h-16 rounded-sm overflow-hidden">
										<Image src={imagePreview} alt="Profile preview" layout="fill" objectFit="cover" />
									</div>
								)}
								<div className="flex items-center gap-2 w-full">
									<Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
									{imagePreview && (
										<X
											className="cursor-pointer"
											onClick={() => {
												setImage(null);
												setImagePreview(null);
											}}
										/>
									)}
								</div>
							</div>
						</div>
						<Button type="submit" className="w-full" disabled={loading} onClick={handleSubmit}>
							{loading ? <Loader2 size={16} className="animate-spin" /> : "Créer un compte"}
						</Button>
					</div>
				</CardContent>
				<CardFooter>
					<div className="flex justify-center w-full border-t py-4">
						<p className="text-center text-xs text-neutral-500">
							<span className="text-orange-400">Kims Hotel.</span>
						</p>
						<p className="text-center text-xs text-neutral-500">

							<Link
								href="/auth/signin"
								className="underline"

							>
								<span className="dark:text-orange-200/90">jai deja un Compte ..Se connecter.</span>
							</Link>
						</p>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
