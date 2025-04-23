'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, ChangeEvent, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { Input } from "../input";
import { Label } from "../label";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Textarea } from "../textarea";
import ProgresseBars from "./progresseBar";
import { ParkingCircle } from "lucide-react";

import { EditSchemaHotel } from "@/Validation/creationHotelShema";
import { getLogementOptionIdName } from "@/app/(action)/LogementOption.action";
import { getShowHotel, updateHotel } from "@/app/(action)/hotel.action";


const steps = [
  { title: "Établissement", description: "Informations sur l'établissement" },
  { title: "Spécificité du L'Hotel", description: "Informations sur l'établissement" },
];

interface Option {
  id: string;
  title: string;
  imageUrl: string;
}

interface PropsParams {
  hotelId: string;
}

interface FormLogement {
  option: [string, ...string[]];
  nom: string;
  description: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;
  type_etoils: number;
  parking: boolean;
  images?: File[];
}

export default function MultiformStepHotelEdit({ hotelId }: PropsParams) {
  const [step, setStep] = useState(1);
  const [imageUrlHotel, setImageUrlHotel] = useState<string[] | null>(null);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [option, setOption] = useState<Option[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue,
  } = useForm<FormLogement>({
    resolver: zodResolver(EditSchemaHotel),
    mode: "onChange",
    defaultValues: {
      option: [],
      nom: "",
      description: "",
      adresse: "",
      ville: "",
      telephone: "",
      email: "",
      type_etoils: 1,
      parking: false,
      images: [],
    },
  });

  const fetchData = useCallback(async () => {
    try {
      const [options, hotelData] = await Promise.all([
        getLogementOptionIdName(),
        getShowHotel(hotelId),
      ]);
      if (options) setOption(options);
      if (hotelData) {
        const hotelOptions = hotelData.hotelOptions?.map((op) => op.optionId) ?? [];
        reset({
          nom: hotelData.nom,
          telephone: hotelData.telephone ?? '',
          adresse: hotelData.adresse ?? '',
          description: hotelData.description ?? '',
          ville: hotelData.ville ?? '',
          email: hotelData.email ?? '',
          type_etoils: hotelData.etoils ?? 1,
          parking: hotelData.parking,
          option: hotelOptions,
        });
        setSelectedOption(hotelOptions);
      }
    } catch (err) {
      console.error(err);
    }
  }, [hotelId, reset]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validationStep = async (nextStep: number) => {
    const stepFields: Record<number, (keyof FormLogement)[]> = {
      1: ["nom", "description", "adresse", "ville", "telephone", "email"],
      2: ["option", "type_etoils", "images"],
    };
    const fields = stepFields[step] || [];
    const isValid = await trigger(fields);
    if (!isValid) {
      setGlobalError("Veuillez corriger les erreurs avant de continuer.");
      return;
    }
    setGlobalError(null);
    setStep(nextStep);
  };

  const handlleSelectOption = (optionId: string) => {
    setSelectedOption((prev) =>
      prev.includes(optionId) ? prev.filter((op) => op !== optionId) : [...prev, optionId]
    );
  };

  const onUploadedImageHotel = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setImageUrlHotel(fileArray.map((file) => URL.createObjectURL(file)));
      setValue("images", fileArray);
    }
  };

  useEffect(() => {
    if (selectedOption.length > 0) {
      setValue("option", selectedOption as [string, ...string[]]);
    }
  }, [selectedOption, setValue]);

  const onSubmit = async (data: FormLogement) => {
    try {
      await updateHotel(
        hotelId,
        data.option,
        data.nom,
        data.description,
        data.adresse,
        data.ville,
        data.telephone,
        data.email,
        data.parking,
        data.type_etoils,
        data.images || []
      )
      toast("Information modifié avec success")
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="mx-auto p-6 max-w-6xl">
      {globalError && (
        <div className="text-red-600 bg-red-100 border border-red-400 p-4 rounded-md text-center">
          {globalError}
        </div>
      )}

      <ProgresseBars curentstep={step} steps={steps} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 lg:px-32">
        {step === 1 && (
          <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {["nom", "ville", "adresse", "telephone", "email"].map((field) => (
              <div key={field}>
                <Input {...register(field as keyof FormLogement)} placeholder={field} />
                {errors[field as keyof FormLogement] && (
                  <span className="text-red-500">{errors[field as keyof FormLogement]?.message}</span>
                )}
              </div>
            ))}
            <div className="lg:col-span-2">
              <Textarea {...register("description")} placeholder="Entrer une description" className="h-32" />
              {errors.description && <span className="text-red-500">{errors.description.message}</span>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {option.map((op) => (
                <div key={op.id} className="flex items-center space-x-2">
                  <Checkbox id={op.id} checked={selectedOption.includes(op.id)} onCheckedChange={() => handlleSelectOption(op.id)} />
                  <Label htmlFor={op.id}>{op.title}</Label>
                  <Image className="dark:bg-white" src={op.imageUrl} width={32} height={32} alt="" />
                </div>
              ))}
            </div>
            {errors.option && <span className="text-red-500">{errors.option.message}</span>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-2">
                <Checkbox
                  id="parking"
                  {...register("parking")}
                  checked={watch("parking")}
                  onCheckedChange={(checked) => setValue("parking", !!checked)}
                />
                <label htmlFor="parking" className="flex items-center text-sm font-medium space-x-2">
                  <ParkingCircle /> <span>Parking</span>
                </label>
              </div>
            </div>

            <div className="mt-5">
              <Label className="block mb-2 text-sm font-medium text-gray-700">
                Télécharger des images de votre Hotel (ce champs n&apos;est pas obligatoire)
              </Label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V8a4 4 0 018 0v8m-4 4h.01M4 16h16" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Cliquez pour télécharger</span> ou faites glisser et déposez 
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (MAX. 800x400px)</p>
                </div>
                <Input type="file" multiple accept="image/*" onChange={onUploadedImageHotel} className="hidden" />
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {imageUrlHotel?.map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    alt={`Preview ${index}`}
                    className="rounded-md shadow object-cover w-full max-w-[128px] max-h-[128px]"
                    width={128}
                    height={128}
                  />
                ))}
              </div>
              {errors.images && <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">{errors.images.message}</div>}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button type="button" className="w-32" onClick={() => validationStep(step - 1)}>
              Précédent
            </Button>
          )}
          {step < 2 ? (
            <Button type="button" className="w-32" onClick={() => validationStep(step + 1)}>
              Suivant
            </Button>
          ) : (
            <button type="submit" className="w-32 bg-primary rounded-sm text-white" disabled={isSubmitting}>
              {isSubmitting ? 'Modification ....' : 'Valider'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}