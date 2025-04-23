'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { Label } from "../label";
import Image from "next/image";
import { Input } from "../input";
import { Snowflake, Tv, Utensils, Wifi } from "lucide-react";
import { Checkbox } from "../checkbox";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Button } from "../button";

import { getChambreById, UpdateChambre } from "@/app/(action)/Chambre.action";
import { toast } from "sonner";
import { Chambre } from "@/types/types";
import { ChambreSchemaUpdate } from "@/Validation/Chambres";

type TypeChambre = "SIMPLE" | "DOUBLE" | "SUITE";
interface FormChambre {
    numero_chambre: string
    type_chambre: TypeChambre,
    capacity: number,
    hasWifi: boolean,
    hasTV: boolean,
    hasClim: boolean,
    hasKitchen: boolean,
    price: number,
    surface: number,
    extraBed: boolean,
    images?: File[] | undefined,
}
interface propsHotelId {
    hotelId: string,
    chambreId: string
}
export default function EditChambre({ hotelId, chambreId }: propsHotelId) {
    const [imageUrl, setImageUrl] = useState<string[] | null>(null)
    const [errorChambre, setErrorChambre] = useState('')
    const [chambre, setChambre] = useState<Chambre>()
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormChambre>({
        resolver: zodResolver(ChambreSchemaUpdate),
        mode: "onChange",
        defaultValues: {
            numero_chambre: chambre?.numero_chambre,
            type_chambre: (chambre?.type as TypeChambre | undefined) ?? ('SIMPLE' as TypeChambre),
            capacity: chambre?.capacity,
            hasClim: chambre?.hasClim,
            hasKitchen: chambre?.hasKitchen,
            hasTV: chambre?.hasTV,
            hasWifi: chambre?.hasWifi,
            price: chambre?.price,
            surface: chambre?.surface ?? 0,
            extraBed: chambre?.extraBed,
            images: [],


        }
    })
    const typeChambreValue = watch("type_chambre");

    const fetchChambre = useCallback(async () => {
        try {
            const data = await getChambreById(chambreId);
            const chambreData = data as unknown as Chambre;
            setChambre(chambreData);
            reset({
                numero_chambre: chambreData.numero_chambre,
                type_chambre: chambreData.type as TypeChambre | undefined,
                capacity: chambreData.capacity,  
                hasClim: chambreData.hasClim,
                hasKitchen: chambreData.hasKitchen,
                hasTV: chambreData.hasTV,
                hasWifi: chambreData.hasWifi,
                price: chambreData.price,
                surface: chambreData.surface ?? 0,
                extraBed: chambreData.extraBed,
                images: [], 
            });
        } catch (err) {
            toast.error("Erreur lors du chargement de la chambre");
            console.error(err);
        }
    }, [chambreId, reset]);

    useEffect(() => {
        fetchChambre();
    }, [fetchChambre]);


    const onUploaded = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            const fileUrls = fileArray.map(file => URL.createObjectURL(file));
            setImageUrl(fileUrls);
            setValue("images", fileArray);

        }
    };
    const onSubmit: SubmitHandler<FormChambre> = async (data) => {
        const response = await UpdateChambre(
            chambreId,
                   data.numero_chambre,
            
                   hotelId,
                   data.capacity,
                   data.hasClim,
                   data.hasWifi,
                   data.hasTV,
                   data.type_chambre,
                   data.surface,
                   data.extraBed,
                   data.price,
                   data.images ?? []
               );
           
               if ('error' in response) {
                   toast.error("Error!", {
                       description: "Verifier les erreur de validation.",
                     })
                   setErrorChambre(response.error)
                
               } else {
                   toast("Information de la chambres modifier avec succès");
                  
                   
                 
               }
    };






    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            {/**<pre>{JSON.stringify(watch(), null, 2)}</pre>**/}

            <div >
                <Label>Numero de chambre </Label>
                <Input type="text"  {...register("numero_chambre")} />
                {errorChambre && <span className="text-red-500">{errorChambre}</span>}
                {errors.numero_chambre && <span className="text-red-500">{errors.numero_chambre.message}</span>}
            </div>
           

            <div className="grid grid-cols-2 gap-4">

                {[
                    { id: "clim", label: "Climatisation", icon: <Snowflake />, field: "hasClim" },
                    { id: "wifi", label: "WiFi", icon: <Wifi />, field: "hasWifi" },
                    { id: "tv", label: "TV", icon: <Tv />, field: "hasTV" },
                    { id: "kitchen", label: "Cuisine", icon: <Utensils />, field: "hasKitchen" },
                    { id: "extraBed", label: "Lit supplémentaire", icon: "🛏️", field: "extraBed" },
                ].map(({ id, label, icon, field }) => (
                    <div key={id} className="flex items-center space-x-3 p-2">

                        <Checkbox
                            id={id}
                            checked={watch(field as keyof FormChambre) as boolean}
                            onCheckedChange={(checked) => setValue(field as keyof FormChambre, !!checked)}
                        />

                        <label htmlFor={id} className="flex items-center text-sm font-medium cursor-pointer space-x-2">
                            {icon} <span>{label}</span>
                        </label>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <Label>Prix </Label>
                    <div className="flex gap-2">
                        <Input type="number"  {...register("price", { valueAsNumber: true })} /> <span>/nuit</span>
                    </div>

                    {errors.price && <span className="text-red-500">{errors.price.message}</span>}
                </div>
                <div>
                    <Label>Capacité </Label>
                    <div className="flex gap-5">
                        <Input type="number"  {...register("capacity", { valueAsNumber: true })} /> <span>Personnes</span>

                    </div>
                    {errors.capacity && <span className="text-red-500">{errors.capacity.message}</span>}
                </div>
                <div>
                    <Label>Surface </Label>
                    <div className="flex gap-5">
                        <Input type="surface"  {...register("surface", { valueAsNumber: true })} /> <span>m²</span>

                    </div>
                    {errors.surface && <span className="text-red-500">{errors.surface.message}</span>}
                </div>
                <div>
                    <Label>Type de Chambre</Label>
                    <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
                        onChange={(e) => setValue("type_chambre", e.target.value as TypeChambre)}
                        value={typeChambreValue}
                    >
                        <option value="" disabled>Sélectionner un type de chambre</option>
                        <option value="SIMPLE">Simple</option>
                        <option value="DOUBLE">Double</option>
                        <option value="SUITE">Suite</option>
                    </select>

                    {errors.type_chambre && <span className="text-red-500">{errors.type_chambre.message}</span>}

                </div>
            </div>
            <div className="mt-5">
                <Label className="block mb-2 text-sm font-medium text-gray-700">Télécharger des images (telecharger 4 Images au minimum)</Label>
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
            <Button type="submit" className="w-32" disabled={isSubmitting}>
                {isSubmitting ? 'Création ....' : ' Valider'}
            </Button>
        </form>
    )
}