'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";

import ProgresseBars from "./progresseBar";
import { Input } from "../input";

import { getLogementOptionIdName } from "@/app/(action)/LogementOption.action";
import { toast } from "sonner"

import { Label } from "../label";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { ParkingCircle, Snowflake, Tv, Utensils, Wifi } from "lucide-react";

import Image from "next/image";
import { Textarea } from "../textarea";
import { useUser } from "@clerk/nextjs";
import { CreationSchemaHotel } from "@/Validation/creationHotelShema";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "../select";
import { createHotel } from "@/app/(action)/hotel.action";

interface FormLogement {
    option: [string, ...string[]];
    nom: string;
    description: string;
    adresse: string;
    ville: string;
    telephone: string;
    email: string;
    type_etoils: number;
    capacity: number;
    hasWifi: boolean;
    hasTV: boolean;
    hasClim: boolean;
    hasKitchen: boolean;
    parking: boolean;
    surface: number;
    extraBed: boolean;
    price: number;
    type_chambre: "SIMPLE" | "DOUBLE" | "SUITE",
    images: File[];
}

const steps = [
    { title: "Établissement", description: "Informations sur l'établissement" },
    { title: "Spécificité du L'Hotel", description: "Informations sur l'établissement" },
    { title: "Chambres", description: "Ajouter Des Chambres" },
];

interface Option {
    id: string,
    title: string,
    imageUrl: string
}

export default function MultiformStepHotel() {
    const { user } = useUser()
    const [step, setStep] = useState(1);
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
        resolver: zodResolver(CreationSchemaHotel),
        mode: "onChange",
        defaultValues: {
            option: [],
            nom: "",
            description: "",
            adresse: "",
            ville: "",
            telephone: "",
            email: "",
            type_chambre: undefined,
            type_etoils: 1,
            parking: false,
            capacity: 1,
            hasWifi: false,
            hasTV: false,
            hasClim: false,
            hasKitchen: false,
            price: 0,
            surface: 0,
            extraBed: false,
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
                fieldValidate = ["option", "parking", "type_etoils"];
                break;
            case 3:
                fieldValidate = ["hasClim", "hasTV", "hasKitchen", "hasWifi", "extraBed", "price", "capacity", "type_chambre", "images"];
                break;
        }
        const isValid = await trigger(fieldValidate);
        console.log(isValid)
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
            const fileArray = Array.from(files);
            const fileUrls = fileArray.map(file => URL.createObjectURL(file));
            setImageUrl(fileUrls);
            setValue("images", fileArray);
        }
    };

    useEffect(() => {
        if (selectedOption.length > 0) {
            setValue('option', selectedOption as [string, ...string[]]);
        }
    }, [selectedOption, setValue]);

    const onSubmit = async (data: FormLogement) => {
        console.log("Form submitted", data); // Ajoutez ce log pour vérifier que la fonction est appelée
        const response = await createHotel(
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
            data.type_chambre,
            data.parking,
            data.surface,
            data.type_etoils,
            data.extraBed,
            data.price,
            data.images
        );
        if ('error' in response) {
            alert(response.error)
        } else {
            toast("Logement créé avec success")
            setTimeout(() => {
                router.push(`/dashboard/hotes/${user?.id}`)
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {[
                                { id: "parking", label: "Parking", icon: <ParkingCircle />, field: "parking" },
                            ].map(({ id, label, icon, field }) => (
                                <div key={id} className="flex items-center space-x-3 p-2">
                                    <Checkbox id={id}  {...register(field as keyof FormLogement)} onCheckedChange={(checked) => setValue(field as keyof FormLogement, checked)} />
                                    <label htmlFor={id} className="flex items-center text-sm font-medium cursor-pointer space-x-2">
                                        {icon} <span>{label}</span>
                                    </label>
                                </div>
                            ))}
                            {errors.parking && <span className="text-red-500">{errors.parking.message}</span>}
                        </div>
                        <div>
                            <Label>Etoils</Label>
                            <Input type="number"  {...register("type_etoils", { valueAsNumber: true })} />
                            {errors.type_etoils && <span className="text-red-500">{errors.type_etoils.message}</span>}
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <>
                        <h1>Ajouter une chambre, vous serez redirigez vers votre dashboard ou vous ajouter autant de chambre que vous voulez</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {[
                                { id: "clim", label: "Climatisation", icon: <Snowflake />, field: "hasClim" },
                                { id: "wifi", label: "WiFi", icon: <Wifi />, field: "hasWifi" },
                                { id: "tv", label: "TV", icon: <Tv />, field: "hasTV" },
                                { id: "kitchen", label: "Cuisine", icon: <Utensils />, field: "hasKitchen" },
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
                        {errors.type_chambre && <span className="text-red-500">{errors.type_chambre.message}</span>}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div>
                                <Label>Prix </Label>
                                <Input type="number"  {...register("price", { valueAsNumber: true })} />
                                {errors.price && <span className="text-red-500">{errors.price.message}</span>}
                            </div>
                            <div>
                                <Label>Capacité </Label>
                                <Input type="number"  {...register("capacity", { valueAsNumber: true })} />
                                {errors.capacity && <span className="text-red-500">{errors.capacity.message}</span>}
                            </div>
                            <div>
                                <Label>Type de Chambre</Label>
                                <Select onValueChange={(value) => setValue("type_chambre", value as "SIMPLE" | "DOUBLE" | "SUITE")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un type de chambre" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="SIMPLE">Simple</SelectItem>
                                            <SelectItem value="DOUBLE">Double</SelectItem>
                                            <SelectItem value="SUITE">Suite</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.type_chambre && <span className="text-red-500">{errors.type_chambre.message}</span>}
                            </div>
                        </div>
                        <div className="mt-5">
                            <Label className="block mb-2 text-sm font-medium text-gray-700">Télécharger des images</Label>
                            <div className="flex flex-col items-center justify-center  gap-3">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V8a4 4 0 018 0v8m-4 4h.01M4 16h16"></path>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Cliquez pour télécharger</span> ou faites glisser et déposez</p>
                                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 800x400px)</p>
                                    </div>
                                    <Input type="file" multiple accept="image/*" onChange={onUploaded} className="hidden" />
                                </label>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    {imageUrl && imageUrl.map((url, index) => (
                                        <Image key={index} src={url} alt={`Preview ${index}`} className="rounded-md shadow w-32 h-32 object-cover" width={128} height={128} />
                                    ))}
                                </div>
                            </div>
                            {errors.images && <span className="text-red-500">{errors.images.message}</span>}
                        </div>
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
                        <Button type="submit" className="w-32" disabled={isSubmitting}>
                            {isSubmitting ? 'Création ....' : ' Valider'}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}