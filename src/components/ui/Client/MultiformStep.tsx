'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreationSchema } from "@/Validation/createHotelLogementShema";

import ProgresseBars from "./progresseBar";
import { Input } from "../input";

import { CreateLogement } from "@/app/(action)/Logement.action";
import { getLogementOptionIdName } from "@/app/(action)/LogementOption.action";
import { toast } from "sonner"

import { Label } from "../label";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Snowflake, Tv, Wifi, Utensils, ParkingCircle } from "lucide-react";

import Image from "next/image";
import { Textarea } from "../textarea";
import { useSession } from "@/src/lib/auth-client";


interface FormLogement {
    option: [string, ...string[]];
    nom: string;
    description: string;
    adresse: string;
    ville: string;
    telephone: string;
    email: string;
    capacity: number;
    hasWifi: boolean;
    hasTV: boolean;
    hasClim: boolean;
    hasKitchen: boolean;
    parking: boolean;
    surface: number;
    extraBed: boolean;
    nbChambres: number;
    price: number;
    images: File[]
}

const steps = [
    { title: "Établissement", description: "Informations sur l'établissement" },
    { title: "Spécificité du L'appartement", description: "Informations sur l'établissement" },
    { title: "Options", description: "Sélectionner les options" },
];

interface Option {
    id: string,
    title: string,
    imageUrl: string
}

export default function MultiformStep() {
    const { data: session, } = useSession();
    const [step, setStep] = useState(1);
    const [uploadProgress] = useState<number>(0);
    const router = useRouter()
    const [imageUrl, setImageUrl] = useState<string[] | null>(null)
    const [selectedOption, setSelectedOption] = useState<string[]>([]);
    const [option, setOption] = useState<Option[]>([])
    const params = useParams()
    const categoryLogementId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? ""
    const getOption = async () => {
        const data = await getLogementOptionIdName();
        if (data) {
            setOption(data);
        }
    };

    useEffect(() => {
        getOption()
    }, [])

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm<FormLogement>({
        resolver: zodResolver(CreationSchema),
        mode: "onChange",
        defaultValues: {
            option: [],
            nom: "",
            description: "",
            adresse: "",
            ville: "",
            telephone: "",
            email: "",
            capacity: 1,
            hasWifi: false,
            hasTV: false,
            hasClim: false,
            hasKitchen: false,
            parking: false,
            surface: 0,
            extraBed: false,
            nbChambres: 1,
            price: 0.0,
            images: []
        },
    });

    useEffect(() => {
        const watchedOption = watch('option')
        if (watchedOption && watchedOption.length > 0 && selectedOption.length === 0) {
            setSelectedOption(watchedOption)
        }
    }, [watch, selectedOption])

    const validationStep = async (nextStep: number) => {
        let fieldValidate: (keyof FormLogement)[] = [];
        switch (step) {
            case 1:
                fieldValidate = ["nom", "description", "adresse", "ville", "telephone", "email"];
                break;
            case 2:
                fieldValidate = ["capacity", "hasWifi", "hasTV", "hasClim", "hasKitchen", "parking", "surface", "extraBed", "nbChambres", "price"];
                break;
            case 3:
                fieldValidate = ["option", "images"];
                break;
        }
        const isValid = await trigger(fieldValidate);
        if (isValid) {
            setStep(nextStep);
        }
    };

    const handlleSelectOption = (options: string) => {
        setSelectedOption(prev => {
            const updatedOptions = prev.includes(options)
                ? prev.filter(op => op !== options)
                : [...prev, options];
            return updatedOptions;
        });
    };

  const onUploaded = (e: ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    // Vérifier la taille des fichiers
    const oversizedFiles = Array.from(files).filter(file => file.size > 5 * 1024 * 1024);
    
    if (oversizedFiles.length > 0) {
      toast.error(`Certains fichiers dépassent 5MB: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    const validFiles = Array.from(files).filter(file => file.size <= 5 * 1024 * 1024);
    const fileUrls = validFiles.map(file => URL.createObjectURL(file));
    
    setImageUrl(prev => [...(prev || []), ...fileUrls]); 
    setValue("images", [...watch("images"), ...validFiles]); 
  }
};

    useEffect(() => {
        if (selectedOption.length > 0) {
            setValue('option', selectedOption as [string, ...string[]]);
        }
    }, [selectedOption, setValue]);

    const onSubmit = async (data: FormLogement) => {

        const response = await CreateLogement(
            categoryLogementId,
            data.option,
            data.nom,
            data.description,
            data.adresse,
            data.ville,
            data.telephone,
            data.email,
            data.capacity,
            data.hasClim,
            data.hasWifi,
            data.hasTV,
            data.hasKitchen,
            data.parking,
            data.surface,
            data.extraBed,
            data.nbChambres,
            data.price,
            data.images
        );
        if ('error' in response) {
            alert(response.error)
        } else {
            toast("Logement créé avec success")

            setTimeout(() => {
                router.push(`/dashboard/hotes/${session?.user?.id}`)
            }, 1000);
        }

    }

    return (
        <div className="mx-2xl mx-auto p-6 ">
            <ProgresseBars curentstep={step} steps={steps} />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8  lg:px-32">
                {step === 1 && (
                    <div className="space-y-4 flex flex-col justify-center m-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-5">
                            <div>
                                <Input {...register("nom")} placeholder="Donner Un Nom A Votre Appartement" />
                                {errors.nom && <span className="text-red-500">{errors.nom.message}</span>}
                            </div>
                            <div>
                                <Input {...register("ville")} placeholder="La ville où se trouve votre Appartement" />
                                {errors.ville && <span className="text-red-500">{errors?.ville?.message}</span>}
                            </div>
                            <div>
                                <Input {...register("adresse")} placeholder="Quartier/Village/District" />
                                {errors.adresse && <span className="text-red-500">{errors?.adresse?.message}</span>}
                            </div>
                            <div>
                                <Input {...register("telephone")} placeholder="Numéro de Téléphone à Contacter" />
                                {errors.telephone && <span className="text-red-500">{errors?.telephone?.message}</span>}
                            </div>
                            <div>
                                <Input {...register("email")} placeholder="Adresse Email" />
                                {errors.email && <span className="text-red-500">{errors?.email?.message}</span>}
                            </div>
                        </div>
                        <Textarea {...register("description")} placeholder="Entrer une description" id="message" className="h-32" />
                        {errors.description && <span className="text-red-500">{errors?.description?.message}</span>}
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div>
                                <Label>Capacité</Label>
                                <Input type="number"  {...register("capacity", { valueAsNumber: true })} />
                                {errors.capacity && <span className="text-red-500">{errors.capacity.message}</span>}
                            </div>
                            <div>
                                <Label>Nombre de Chambre</Label>
                                <Input type="number" {...register("nbChambres", { valueAsNumber: true })} />
                                {errors.nbChambres && <span className="text-red-500">{errors.nbChambres.message}</span>}
                            </div>
                            <div>
                                <Label>Surface</Label>
                                <div className="flex space-x-2">
                                    <Input type="number" {...register("surface", { valueAsNumber: true })} /><span>m²</span>
                                </div>
                                {errors.surface && <span className="text-red-500">{errors.surface.message}</span>}
                            </div>
                            <div>
                                <Label>Prix</Label>
                                <div className="flex space-x-2">
                                    <Input type="number" {...register("price", { valueAsNumber: true })} /> <span>/jours</span>
                                </div>
                                {errors.price && <span className="text-red-500">{errors.price.message}</span>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {[
                                { id: "clim", label: "Climatisation", icon: <Snowflake />, field: "hasClim" },
                                { id: "wifi", label: "WiFi", icon: <Wifi />, field: "hasWifi" },
                                { id: "tv", label: "TV", icon: <Tv />, field: "hasTV" },
                                { id: "kitchen", label: "Cuisine", icon: <Utensils />, field: "hasKitchen" },
                                { id: "parking", label: "Parking", icon: <ParkingCircle />, field: "parking" },
                                { id: "extraBed", label: "Lit supplémentaire", icon: "🛏️", field: "extraBed" },
                            ].map(({ id, label, icon, field }) => (
                                <div key={id} className="flex items-center space-x-3 p-2">
                                    <Checkbox id={id}  {...register(field as keyof FormLogement)} onCheckedChange={(checked) => setValue(field as keyof FormLogement, checked)} />
                                    <label htmlFor={id} className="flex items-center text-sm font-medium cursor-pointer space-x-2">
                                        {icon} <span>{label}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                            {option.map((op) => (
                                <div key={op.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={op.id}
                                        checked={selectedOption.includes(op.id)}
                                        onCheckedChange={() => handlleSelectOption(op.id)}
                                    />
                                    <Label htmlFor={op.id}>{op.title}</Label><Image className="dark:bg-white" src={op.imageUrl} width={32} height={32} alt="" />
                                </div>
                            ))}
                        </div>
                        {errors.option && <span className="text-red-500">{errors.option.message}</span>}
                        <div className="mt-5">
                            <Label className="block mb-2 text-sm font-medium text-gray-700">
                                Télécharger des images (télécharger 4 Images au minimum)
                            </Label>
                            <div className="flex flex-col items-center justify-center gap-3">
                                {/* Boutons de choix pour mobile */}
                                <div className="flex gap-2 w-full md:hidden">
                                    <Button
                                        type="button"
                                        onClick={() => document.getElementById('file-input')?.click()}
                                        className="w-full"
                                    >
                                        Choisir depuis la galerie
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => document.getElementById('camera-input')?.click()}
                                        className="w-full"
                                    >
                                        Prendre une photo
                                    </Button>
                                </div>

                                {/* Inputs cachés */}
                                <input
                                    id="file-input"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={onUploaded}
                                    className="hidden"
                                />
                                <input
                                    id="camera-input"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={onUploaded}
                                    className="hidden"
                                    capture="environment"
                                />

                                {/* Zone de dépôt pour desktop */}
                                <label className="hidden md:flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V8a4 4 0 018 0v8m-4 4h.01M4 16h16"></path>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Cliquez pour télécharger</span> ou faites glisser et déposez
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB par image)</p>
                                    </div>
                                    <Input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={onUploaded}
                                        className="hidden"
                                    />
                                </label>

                                {/* Aperçu des images */}
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    {imageUrl && imageUrl.map((url, index) => (
                                        <div key={index} className="relative">
                                            <Image
                                                src={url}
                                                alt={`Preview ${index}`}
                                                className="rounded-md shadow w-32 h-32 object-cover"
                                                width={128}
                                                height={128}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageUrl(prev => prev?.filter((_, i) => i !== index) || null);
                                                    setValue("images", watch("images").filter((_, i) => i !== index));
                                                }}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {isSubmitting && (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div 
      className="bg-blue-600 h-2.5 rounded-full" 
      style={{ width: `${uploadProgress}%` }}
    ></div>
  </div>
)}

                    </>
                )}
                <div className="flex justify-between mt-6">
                    {step > 1 && (
                        <Button type="button" className="w-32" onClick={() => validationStep(step - 1)}>
                            Précédent
                        </Button>
                    )}
                    {step < 3 ? (
                        <Button type="button" className="w-32" onClick={() => validationStep(step + 1)}>
                            Suivant
                        </Button>
                    ) : (
                        <button type="submit" className="w-32 bg-primary p-2 rounded-md text-white" disabled={isSubmitting}>
                            {isSubmitting ? 'Création ....' : ' Valider'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}