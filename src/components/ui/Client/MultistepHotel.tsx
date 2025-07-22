'use client'
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Wifi, Tv, Snowflake, Utensils, ParkingCircle, Bed, Star } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/src/lib/auth-client";
import { getLogementOptionIdName } from "@/app/(action)/LogementOption.action";
import Image from "next/image";
import { createHotel } from "@/app/(action)/hotel.action";
import { CitySelect } from "./citySelect";
import { cn } from "@/src/lib/utils";

interface FormData {
  option: string[];
  nom: string;
  description: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;
  etoils: number;
  capacity: number;
  hasWifi: boolean;
  hasTV: boolean;
  hasClim: boolean;
  hasKitchen: boolean;
  parking: boolean;
  surface: number;
  extraBed: boolean;
  price: number;
  numero_chambre: string;
  type_chambre: "SIMPLE" | "DOUBLE" | "SUITE";
  images: File[];
  images_hotel: File[];
}

interface Option {
  id: string;
  title: string;
  imageUrl: string;
}

const steps = [
  { id: 1, title: "Informations", description: "Détails de l'hôtel" },
  { id: 2, title: "Équipements", description: "Services et options" },
  { id: 3, title: "Chambres", description: "Configuration des chambres" },
];

export default function HotelCreationForm() {
  const { data: session } = useSession();
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [option, setOption] = useState<Option[]>([]);
  const [step, setStep] = useState(1);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [hotelImagePreviews, setHotelImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const categoryLogementId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";

  const [formData, setFormData] = useState<FormData>({
    option: [],
    nom: "",
    description: "",
    adresse: "",
    ville: "",
    etoils: 1,
    telephone: "",
    email: "",

    capacity: 1,
    hasWifi: false,
    hasTV: false,
    hasClim: false,
    hasKitchen: false,
    parking: false,
    surface: 20,
    extraBed: false,
    price: 500000,
    type_chambre: "SIMPLE",
    numero_chambre: "",
    images: [],
    images_hotel: []
  });

  // Chargement des options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data = await getLogementOptionIdName();
        if (data) setOption(data);
      } catch (error) {
        console.error("Erreur lors du chargement des options:", error);
        toast.error("Erreur lors du chargement des options");
      }
    };
    loadOptions();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectOption = (optionId: string) => {
    const newOptions = selectedOption.includes(optionId)
      ? selectedOption.filter(id => id !== optionId)
      : [...selectedOption, optionId];

    setSelectedOption(newOptions);
    setFormData(prev => ({ ...prev, option: newOptions }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, type: "room" | "hotel") => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const validFiles = files.filter(file =>
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      toast.error("Certains fichiers ne sont pas valides (max 5MB)");
    }

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));

    if (type === "room") {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...validFiles] }));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    } else {
      setFormData(prev => ({ ...prev, images_hotel: [...prev.images_hotel, ...validFiles] }));
      setHotelImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number, type: "room" | "hotel") => {
    if (type === "room") {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      setFormData(prev => ({
        ...prev,
        images_hotel: prev.images_hotel.filter((_, i) => i !== index)
      }));
      setHotelImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateStep = (): boolean => {
    // Validation étape 1
    if (step === 1) {
      if (!formData.nom || formData.nom.length < 3) {
        toast.error("Le nom doit contenir au moins 3 caractères");
        return false;
      }
      if (!formData.ville) {
        toast.error("La ville est obligatoire");
        return false;
      }
      if (!formData.adresse || formData.adresse.length < 5) {
        toast.error("L'adresse doit contenir au moins 5 caractères");
        return false;
      }
      if (!formData.telephone || !/^\+?[0-9]{8,15}$/.test(formData.telephone)) {
        toast.error("Numéro de téléphone invalide");
        return false;
      }
      if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        toast.error("Email invalide");
        return false;
      }
      if (!formData.description || formData.description.length < 20) {
        toast.error("La description doit contenir au moins 20 caractères");
        return false;
      }
    }


    if (step === 2) {
      if (formData.images_hotel.length < 4) {
        toast.error("Minimum 4 photos de l'hôtel requises");
        return false;
      }
    }


    if (step === 3) {
      if (!formData.type_chambre) {
        toast.error("Le type de chambre est obligatoire");
        return false;
      }
      if (!formData.price || formData.price < 10000) {
        toast.error("Le prix minimum est de 10,000 GNF");
        return false;
      }
      if (!formData.capacity || formData.capacity < 1) {
        toast.error("La capacité minimale est de 1 personne");
        return false;
      }
      if (!formData.surface || formData.surface < 9) {
        toast.error("La surface minimale est de 9m²");
        return false;
      }
      if (formData.images.length < 4) {
        toast.error("Minimum 4 photos de la chambre requises");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'option') {
          formPayload.append(key, JSON.stringify(value));
        } else if (key === 'images' || key === 'images_hotel') {
          (value as File[]).forEach((file, index) => {
            formPayload.append(`${key}_${index}`, file);
          });
        } else {
          formPayload.append(key, String(value));
        }
      });

      await createHotel(
        categoryLogementId,
        formData.numero_chambre,
        formData.option,
        formData.nom,
        formData.description,
        formData.adresse,
        formData.ville,
        formData.telephone,
        formData.email,
        Number(formData.capacity),
        formData.hasClim,
        formData.hasWifi,
        formData.hasTV,
        formData.type_chambre,
        formData.parking,
        formData.surface,
        Number(formData.etoils),
        formData.extraBed,
        Number(formData.price),
        formData.images,
        formData.images_hotel
      );
      toast.success("Hôtel créé avec succès");
      router.push(`/dashboard/hotes/${session?.user?.id}`);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la création de l'hôtel");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
  const buttonStyle = "px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50";
  const stepButtonStyle = "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md";
  const labelStyle="block text-sm font-medium text-gray-700 dark:text-gray-300"
  return (
    <div className="mx-auto p-4 md:p-6 max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-800/50">

      <div className="flex mb-8 relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10 mx-10">
          <div
            className="h-1 bg-blue-500 dark:bg-blue-400 transition-all duration-300"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {steps.map((stepItem) => (
          <div key={stepItem.id} className="flex-1 flex flex-col items-center">
            <div className={`${stepButtonStyle} ${step >= stepItem.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
              {stepItem.id}
            </div>
            <div className={`text-sm mt-2 text-center font-medium ${step >= stepItem.id ? 'text-blue-500' : 'text-gray-500'
              }`}>
              {stepItem.title}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Informations de l&lsquo;hôtel</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={labelStyle}>Nom de l&lsquo;hôtel *</Label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="Ex: Hôtel Riviera"
                />
              </div>

              <div className="space-y-2">
                <div className="space-y-2">
                  <Label className={labelStyle}>Ville *</Label>
                  <CitySelect
                    value={formData.ville}
                    onChange={(value) => handleSelectChange("ville", value)}
                  />
                </div>

              </div>

              <div className="space-y-2">
                <Label className={labelStyle}>Adresse *</Label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="Quartier Minière"
                />
              </div>

              <div className="space-y-2">
                <Label className={labelStyle}>Téléphone *</Label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="622 00 00 00"
                />
              </div>

              <div className="space-y-2">
                <Label className={labelStyle}>Email *</Label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="contact@hotel.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className={labelStyle}>Description *</Label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`${inputStyle} min-h-32`}
                placeholder="Décrivez votre hôtel..."
              />
            </div>
          </div>
        )}
        {step === 2 && (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Équipements et services</h2>

    <div>
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Options disponibles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {option.map((op) => (
          <div
            key={op.id}
            className={cn(
              "flex items-center p-3 border rounded-lg cursor-pointer transition-colors",
              selectedOption.includes(op.id)
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
            )}
            onClick={() => handleSelectOption(op.id)}
          >
            <input
              type="checkbox"
              id={op.id}
              checked={selectedOption.includes(op.id)}
              className={cn(
                "mr-3 h-5 w-5 rounded focus:ring-2 focus:ring-blue-500",
                "text-blue-600 dark:text-blue-500",
                "border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-gray-800"
              )}
              onChange={() => {}}
            />
            {op.imageUrl && (
              <Image
                src={op.imageUrl}
                width={32}
                height={32}
                alt={op.title}
                className="mr-3 rounded"
              />
            )}
            <label htmlFor={op.id} className="cursor-pointer text-gray-700 dark:text-gray-300">
              {op.title}
            </label>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-200">Services principaux</h3>
        <div className="space-y-3">
          <div className={cn(
            "flex items-center p-3 border rounded-lg transition-colors cursor-pointer",
            "hover:bg-gray-50 dark:hover:bg-gray-800",
            "border-gray-200 dark:border-gray-700"
          )}>
            <input
              type="checkbox"
              id="parking"
              name="parking"
              checked={formData.parking}
              onChange={handleCheckboxChange}
              className={cn(
                "mr-3 h-5 w-5 rounded focus:ring-2 focus:ring-blue-500",
                "text-blue-600 dark:text-blue-500",
                "border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-gray-800"
              )}
            />
            <label htmlFor="parking" className="flex items-center cursor-pointer">
              <ParkingCircle className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300">Parking sécurisé</span>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300">Classement étoiles *</Label>
        <div className="flex items-center">
          <input
            type="number"
            name="etoils"
            min="1"
            max="5"
            value={formData.etoils}
            onChange={handleInputChange}
            className={cn(
              "w-20 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500",
              "border-gray-300 dark:border-gray-600",
              "bg-white dark:bg-gray-800",
              "text-gray-900 dark:text-white"
            )}
          />
          <div className="ml-3 flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-5 h-5",
                  i < formData.etoils 
                    ? "text-yellow-400 fill-yellow-400" 
                    : "text-gray-300 dark:text-gray-500"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <Label className="text-gray-700 dark:text-gray-300">Photos de l&apos;hôtel *</Label>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Minimum 4 photos de votre établissement
      </p>

      <label className={cn(
        "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg",
        "cursor-pointer transition-colors",
        "border-gray-300 dark:border-gray-600",
        "hover:bg-gray-50 dark:hover:bg-gray-800"
      )}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg 
            className="w-10 h-10 mb-3 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Cliquez pour télécharger</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (max 5MB)</p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "hotel")}
          className="hidden"
        />
      </label>

      {hotelImagePreviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {hotelImagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <Image
                src={preview}
                alt={`Preview ${index}`}
                width={150}
                height={150}
                className="rounded-lg object-cover w-full h-32"
              />
              <button
                type="button"
                onClick={() => removeImage(index, "hotel")}
                className={cn(
                  "absolute top-2 right-2 rounded-full w-6 h-6",
                  "flex items-center justify-center transition-opacity",
                  "bg-red-500 text-white opacity-0 group-hover:opacity-100"
                )}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

        {/* Étape 3 - Chambres */}
        {step === 3 && (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Configuration des chambres</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300">Numero de Chambre (Unique) *</Label>
        <div className="flex items-center">
          <input
            type="text"
            name="numero_chambre"
            value={formData.numero_chambre}
            onChange={handleInputChange}
            className={cn(
              "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500",
              "border-gray-300 dark:border-gray-600",
              "bg-white dark:bg-gray-800",
              "text-gray-900 dark:text-white"
            )}
            placeholder="CHAMBRE 101"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300">Type de chambre *</Label>
        <select
          name="type_chambre"
          value={formData.type_chambre}
          onChange={(e) => handleSelectChange("type_chambre", e.target.value)}
          className={cn(
            "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500",
            "border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-white"
          )}
        >
          <option value="SIMPLE">Simple</option>
          <option value="DOUBLE">Double</option>
          <option value="SUITE">Suite</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300">Prix par nuit (GNF) *</Label>
        <div className="flex items-center">
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className={cn(
              "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500",
              "border-gray-300 dark:border-gray-600",
              "bg-white dark:bg-gray-800",
              "text-gray-900 dark:text-white"
            )}
            placeholder="500000"
            min="10000"
          />
          <span className="ml-2 whitespace-nowrap text-gray-700 dark:text-gray-300">GNF/nuit</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300">Capacité (personnes) *</Label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleInputChange}
          className={cn(
            "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500",
            "border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-white"
          )}
          min="1"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300">Surface (m²) *</Label>
        <div className="flex items-center">
          <input
            type="number"
            name="surface"
            value={formData.surface}
            onChange={handleInputChange}
            className={cn(
              "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500",
              "border-gray-300 dark:border-gray-600",
              "bg-white dark:bg-gray-800",
              "text-gray-900 dark:text-white"
            )}
            min="9"
          />
          <span className="ml-2 text-gray-700 dark:text-gray-300">m²</span>
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-200">Équipements de la chambre</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { id: "wifi", label: "WiFi", icon: <Wifi className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />, field: "hasWifi" },
          { id: "clim", label: "Climatisation", icon: <Snowflake className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />, field: "hasClim" },
          { id: "tv", label: "Télévision", icon: <Tv className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />, field: "hasTV" },
          { id: "kitchen", label: "Cuisine", icon: <Utensils className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />, field: "hasKitchen" },
          { id: "extraBed", label: "Lit supplémentaire", icon: <Bed className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />, field: "extraBed" },
        ].map(({ id, label, icon, field }) => (
          <div
            key={id}
            className={cn(
              "flex items-center p-3 border rounded-lg cursor-pointer transition-colors",
              formData[field as keyof FormData]
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
            )}
            onClick={() => setFormData(prev => ({ ...prev, [field]: !prev[field as keyof FormData] }))}
          >
            <input
              type="checkbox"
              id={id}
              checked={Boolean(formData[field as keyof FormData])}
              className={cn(
                "mr-3 h-5 w-5 rounded focus:ring-2 focus:ring-blue-500",
                "text-blue-600 dark:text-blue-500",
                "border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-gray-800"
              )}
              onChange={() => {}}
            />
            <label htmlFor={id} className="flex items-center cursor-pointer text-gray-700 dark:text-gray-300">
              {icon} {label}
            </label>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-4">
      <Label className="text-gray-700 dark:text-gray-300">Photos de la chambre *</Label>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Minimum 4 photos de votre chambre</p>

      <label className={cn(
        "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg",
        "cursor-pointer transition-colors",
        "border-gray-300 dark:border-gray-600",
        "hover:bg-gray-50 dark:hover:bg-gray-800"
      )}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Cliquez pour télécharger</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (max 5MB)</p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "room")}
          className="hidden"
        />
      </label>

      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt={`Preview ${index}`}
                width={150}
                height={150}
                className="rounded-lg object-cover w-full h-32"
              />
              <button
                type="button"
                onClick={() => removeImage(index, "room")}
                className={cn(
                  "absolute top-2 right-2 rounded-full w-6 h-6",
                  "flex items-center justify-center transition-opacity",
                  "bg-red-500 text-white opacity-0 group-hover:opacity-100"
                )}
              >
                ×
              </button>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

        {/* Navigation */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className={`${buttonStyle} bg-gray-100 text-gray-700 hover:bg-gray-200`}
            >
              Précédent
            </button>
          ) : <div></div>}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => validateStep() && setStep(step + 1)}
              className={`${buttonStyle} bg-blue-500 hover:bg-blue-600 text-white`}
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${buttonStyle} bg-blue-500 hover:bg-blue-600 text-white`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création en cours...
                </span>
              ) : 'Créer l\'hôtel'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// Composants UI simplifiés
const Label = ({ children, ...props }: { children: React.ReactNode } & React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className="block text-sm font-medium text-gray-700 mb-1" {...props}>
    {children}
  </label>
);