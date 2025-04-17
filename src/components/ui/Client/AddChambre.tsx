'use client'
import { Chambreshema } from "@/Validation/Chambres"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { Label } from "../label";
import Image from "next/image";
import { Input } from "../input";
import { Snowflake, Tv, Utensils, Wifi } from "lucide-react";
import { Checkbox } from "../checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../select";
import { ChangeEvent, useState } from "react";
import { Button } from "../button";
import { Textarea } from "../textarea";
import { CreateChambre } from "@/app/(action)/Chambre.action";
import { toast } from "sonner";

type TypeChambre = "SIMPLE" | "DOUBLE" | "SUITE";
interface FormChambre {
    numero_chambre: string
    type_chambre: TypeChambre,
    capacity: number,
    description: string,
    hasWifi: boolean,
    hasTV: boolean,
    hasClim: boolean,
    hasKitchen: boolean,
    price: number,
    surface: number,
    extraBed: boolean,
    images: File[],
}
interface propsHotelId {
    hotelId: string
}
export default function AddChambre({ hotelId }: propsHotelId) {
    const [imageUrl, setImageUrl] = useState<string[] | null>(null)
    const [errorChambre,setErrorChambre]=useState('')
    const {
        register,
        handleSubmit,
        // watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormChambre>({
        resolver: zodResolver(Chambreshema),
        mode: "onChange",
        defaultValues: {
            numero_chambre: '',
            type_chambre: "SIMPLE",
            capacity: 1,
            description: '',
            hasClim: false,
            hasKitchen: false,
            hasTV: false,
            hasWifi: false,
            price: 100000,
            surface: 9,
            extraBed: false,
            images: [],


        }
    })
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
        const response = await CreateChambre(
            data.numero_chambre,
            data.description,
            hotelId,
            data.capacity,
            data.hasClim,
            data.hasWifi,
            data.hasTV,
            data.type_chambre,
            data.surface,
            data.extraBed,
            data.price,
            data.images
        );
    
        if ('error' in response) {
            toast.error("Error!", {
                description: "Verifier les erreur de validation.",
              })
            setErrorChambre(response.error)
         
        } else {
            toast("Chambre créée avec succès");
            setValue('numero_chambre','')
            setValue('description','')
            setValue('capacity',0)
            setValue('extraBed',false)
            setValue('hasClim',false)
            setValue('hasWifi',false)
            setValue('images',[])
            setValue('price',0)
           
        }
    };
    





    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            {/**<pre>{JSON.stringify(watch(), null, 2)}</pre>**/}

            <div >
                <Label>Numero de chambre </Label>
                <Input type="text"  {...register("numero_chambre")} />
                    {errorChambre && <span  className="text-red-500">{errorChambre}</span>}
                {errors.numero_chambre && <span className="text-red-500">{errors.numero_chambre.message}</span>}
            </div>
            <div>
                <Label>Entrer Une Description </Label>
                <Textarea {...register("description")} placeholder="description" id="message" className="h-32 mt-5" />
                {errors.description && <span className="text-red-500">{errors?.description?.message}</span>}
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

                        <Checkbox id={id}  {...register(field as keyof FormChambre)} onCheckedChange={(checked) => setValue(field as keyof FormChambre, checked)} />
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