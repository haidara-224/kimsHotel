'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CreationSchema } from "@/Validation/createHotelLogementShema"; // Vérifie bien le nom du fichier !

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

}

const steps = [

    { title: "Établissement", description: "Informations sur l'établissement" },
    { title: "Spécificité du L'appartement", description: "Informations sur l'établissement" },
    { title: "Options", description: "Sélectionner les options" },
    //{ title: "Images", description: "Ajouter des images de votre appartement" },
];
interface Option {
    id: string,
    title: string,
    imageUrl: string
}
export default function MultiformStep() {
   

   
    const [step, setStep] = useState(1);

    const [selectedOption, setSelectedOption] = useState<string[]>([]);

    const [option, setOption] = useState<Option[]>([])
    const params = useParams()
    const categoryLogementId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? ""
    const getOption = async () => {
        const data = await getLogementOptionIdName();
        console.log(data)

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
        formState: { errors },
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
                fieldValidate = ["option"];
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
            data.price
        );
        if ('error' in response) {
            // Affichage de l'erreur dans l'interface
            alert(response.error)
            // Ou tu peux mettre un message d'erreur dans un état pour l'afficher dans le DOM
        } else {
            // Le logement a été créé avec succès
            toast("Logement créé avec success")

      
        }

    }
    return (
        <div className="mx-2xl mx-auto p-6  ">
            {/* Barre de progression */}
            <ProgresseBars curentstep={step} steps={steps} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-32">
                {/* Étape 1 */}
                {step === 1 && (
                    <div className="space-y-4  flex flex-col justify-center items-center m-auto ">
                        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-5">
                        <Input {...register("nom")} placeholder="Donner Un Nom A Votre Appartement"/>
                        {errors.nom && <span className="text-red-500">{errors.nom.message}</span>}
                       
                       
                        <Input {...register("ville")} placeholder="La ville où se trouve votre Appartement" />
                        {errors.ville && <span className="text-red-500">{errors?.ville?.message}</span>}
                        <Input {...register("adresse")} placeholder="Quartier/Village/District" />
                        {errors.adresse && <span className="text-red-500">{errors?.adresse?.message}</span>}
                        <Input {...register("telephone")} placeholder="Numéro de Téléphone à Contacter" />
                        {errors.telephone && <span className="text-red-500">{errors?.telephone?.message}</span>}
                        <Input {...register("email")} placeholder="Adresse Email" />
                        {errors.email && <span className="text-red-500">{errors?.email?.message}</span>}
                        </div>
                       
                        <Textarea {...register("description")}  placeholder="Entrer une description" id="message" className="h-32" />
                        {errors.description && <span className="text-red-500">{errors?.description?.message}</span>}
                    </div>
                )}

                {/* Étape 2 */}
                {step === 2 && (
                    <div className="space-y-6">
                        {/* Capacité */}
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

                            <Input type="number" {...register("surface", { valueAsNumber: true })} />
                            {errors.surface && <span className="text-red-500">{errors.surface.message}</span>}
                        </div>
                        <div>
                            <Label>Prix</Label>

                            <Input type="number" {...register("price", { valueAsNumber: true })} />
                            {errors.price && <span className="text-red-500">{errors.price.message}</span>}
                        </div>
                      </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {[
                                { id: "clim", label: "Climatisation", icon: <Snowflake />, field: "hasClim" },
                                { id: "wifi", label: "WiFi", icon: <Wifi />, field: "hasWifi" },
                                { id: "tv", label: "TV", icon: <Tv />, field: "hasTV" },
                                { id: "kitchen", label: "Cuisine", icon: <Utensils />, field: "hasKitchen" },
                                { id: "parking", label: "Parking", icon: <ParkingCircle />, field: "parking" },
                                { id: "extraBed", label: "Lit supplémentaire", icon: "🛏️", field: "extraBed" },
                            ].map(({ id, label, icon, field }) => (
                                <div key={id} className="flex items-center space-x-3  p-2 ">
                                    <Checkbox id={id}  {...register(field as keyof FormLogement)} onCheckedChange={(checked) => setValue(field as keyof FormLogement, checked)} />
                                    <label htmlFor={id} className="flex items-center text-sm font-medium cursor-pointer space-x-2">
                                        {icon} <span>{label}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Étape 3 */}
                {step === 3 && (

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {option.map((op) => (
                            <div key={op.id} className="flex items-center space-x-2">
                                <Checkbox
                                    checked={selectedOption.includes(op.id)}
                                    onCheckedChange={() => handlleSelectOption(op.id)}
                                />
                                <Label>{op.title}</Label><Image className="dark:bg-white" src={op.imageUrl} width={32} height={32} alt="" />
                            </div>
                        ))}

                    </div>
                )}
                {errors.option && <span className="text-red-500">{errors.option.message}</span>}
                {/* 📌 Boutons Navigation (Toujours affichés sauf étape finale) */}
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
                        <Button type="submit" className="w-32" >
                            Valider
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );

}
