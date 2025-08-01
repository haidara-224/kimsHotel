"use client"
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { signIn, useSession } from "@/src/lib/auth-client";
import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner"
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [serveurError, setServeurError] = useState<{ [key: string]: string }>({})
  const router = useRouter();
  const { data: session } = useSession();
   
  
    const isAuthenticated = !!session;
  
    useEffect(()=>{
      if(isAuthenticated){
        return router.push('/')
      }
    },[isAuthenticated,router])
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
          <CardDescription className="text-xs md:text-sm">
            Entrez votre adresse e-mail ci-dessous pour vous connecter à votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {serveurError && serveurError.message && (
            <p className="text-red-600 text-sm">{serveurError.message}</p>
          )}
          <div className="grid gap-4">
            <div className="grid gap-2">

              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="password"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                onClick={() => {
                  setRememberMe(!rememberMe);
                }}
              />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              onClick={async () => {
                const { error } = await signIn.email(
                  {
                    email,
                    password
                  },
                  {
                    onRequest: () => {
                      setLoading(true);
                    },
                    onResponse: () => {
                      setLoading(false);
                    },
                    onSuccess: async () => {
                      router.push("/");
                    },
                  },
                );
                if (error) {
                  toast.error(error.message)
                  setServeurError({ message: error.message ?? "An unknown error occurred." });
                }
              }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <p> Login </p>
              )}
            </Button>

            <div className={cn(
              "w-full gap-2 flex items-center",
              "justify-between flex-col"
            )}>

              <Button
                variant="outline"
                className={cn(
                  "w-full gap-2"
                )}
                disabled={loading}
                onClick={async () => {
                  await signIn.social(
                    {
                      provider: "google",
                      callbackURL: "/"
                    },
                    {
                      onRequest: () => {
                        setLoading(true);
                      },
                      onResponse: () => {
                        setLoading(false);
                      },
                    },
                  );
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
                  <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                  <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                  <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                  <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                </svg>
                Sign in with Google
              </Button>
              {
                /**
                 *               <Button
                variant="outline"
                className={cn(
                  "w-full gap-2"
                )}
                disabled={loading}
                onClick={async () => {
                  await signIn.social(
                    {
                      provider: "facebook",
                      callbackURL: "/"
                    },
                    {
                      onRequest: () => {
                        setLoading(true);
                      },
                      onResponse: () => {
                        setLoading(false);
                      },
                    },
                  );
                }}
              >
                
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592c.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"
                    fill="currentColor"
                  ></path>
                </svg>
                Sign in with Facebook
              </Button>
                 */
              }

            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center w-full border-t py-4">
            <p className="text-center text-xs text-neutral-500">

              <Link
                href="/auth/signup"
                className="underline"

              >
                <span className="dark:text-orange-200/90">creer Mon Compte.</span>
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}