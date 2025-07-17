'use client'
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Wifi, Tv, Snowflake, Utensils, ParkingCircle, Bed } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/src/lib/auth-client";
import { getLogementOptionIdName } from "@/app/(action)/LogementOption.action";
import Image from "next/image";
import { CreateLogement } from "@/app/(action)/Logement.action";

interface FormData {
  option: string[];
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
  images: File[];
}

interface Option {
  id: string;
  title: string;
  imageUrl: string;
}

export default function MultiformStep() {
  const { data: session } = useSession();
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [option, setOption] = useState<Option[]>([]);
  const [step, setStep] = useState(1);
  
  const getOption = async () => {
    try {
      const data = await getLogementOptionIdName();
      if (data) setOption(data);
    } catch (error) {
        console.error("Erreur lors du chargement des options:", error);
      toast.error("Erreur lors du chargement des options");
    }
  };

  useEffect(() => {
    getOption();
  }, []);

  const [formData, setFormData] = useState<FormData>({
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
    price: 0,
    images: []
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const categoryLogementId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId) 
        : [...prev, optionId]
    );
    setFormData(prev => ({
      ...prev,
      option: prev.option.includes(optionId)
        ? prev.option.filter(id => id !== optionId)
        : [...prev.option, optionId]
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      toast.error("Certains fichiers ne sont pas valides (max 5MB)");
    }

    setFormData(prev => ({ ...prev, images: [...prev.images, ...validFiles] }));

    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!formData.nom || formData.nom.length < 3) {
        toast.error("Nom invalide (min 3 caractères)");
        return false;
      }
      if (!formData.ville || formData.ville.length < 2) {
        toast.error("Ville invalide");
        return false;
      }
      if (!formData.adresse || formData.adresse.length < 1) {
        toast.error("Adresse invalide");
        return false;
      }
      if (!formData.telephone || !/^\+?[0-9]{7,15}$/.test(formData.telephone)) {
        toast.error("Téléphone invalide");
        return false;
      }
      if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        toast.error("Email invalide");
        return false;
      }
      if (!formData.description || formData.description.length < 10) {
        toast.error("Description trop courte (min 10 caractères)");
        return false;
      }
    }

    if (step === 2) {
      if (formData.capacity < 1) {
        toast.error("Capacité minimale: 1");
        return false;
      }
      if (formData.nbChambres < 1) {
        toast.error("Nombre de chambres minimum: 1");
        return false;
      }
      if (formData.surface < 9) {
        toast.error("Surface minimale: 9 m²");
        return false;
      }
      if (formData.price < 100000) {
        toast.error("Prix minimum: 100000");
        return false;
      }
    }

    if (step === 3) {
      if (formData.images.length < 4) {
        toast.error("Minimum 4 images requises");
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
      formPayload.append('categoryLogementId', categoryLogementId);
      formPayload.append('options', JSON.stringify(formData.option));
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'option' && key !== 'images') {
          formPayload.append(key, String(value));
        }
      });

      formData.images.forEach((file, index) => {
        formPayload.append(`image_${index}`, file);
      });

      await CreateLogement(
        categoryLogementId,
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
        formData.hasKitchen,
        formData.parking,
        Number(formData.surface),
        formData.extraBed,
        Number(formData.nbChambres),
        Number(formData.price),
        formData.images
      )

      toast.success("Logement créé avec succès");
      router.push(`/dashboard/hotes/${session?.user?.id}`);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la création du logement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto p-4 md:p-6 max-w-4xl bg-white rounded-lg shadow-md">
      {/* Progress Bar */}
      <div className="flex mb-8 relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10 mx-10">
          <div 
            className="h-1 bg-primary transition-all duration-300" 
            style={{ width: `${(step - 1) * 50}%` }}
          ></div>
        </div>
        
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex-1 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}
              border-4 border-white shadow-md`}>
              {stepNumber}
            </div>
            <div className={`text-sm mt-2 text-center font-medium
              ${step >= stepNumber ? 'text-primary' : 'text-gray-500'}`}>
              {stepNumber === 1 && "Informations"}
              {stepNumber === 2 && "Caractéristiques"}
              {stepNumber === 3 && "Galerie"}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Étape 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Informations de base</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nom de l&apos;établissement</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: Villa les Palmiers"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Ville</label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Ex: Conakry"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Ex: Kipé"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Ex: 60000000"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Ex: contact@villa.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary h-32"
                placeholder="Décrivez votre établissement en détail..."
                required
              />
            </div>
          </div>
        )}

        {/* Étape 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Caractéristiques du logement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Capacité (personnes)</label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nombre de chambres</label>
                <input
                  type="number"
                  name="nbChambres"
                  min="1"
                  value={formData.nbChambres}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Surface (m²)</label>
                <input
                  type="number"
                  name="surface"
                  min="9"
                  value={formData.surface}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Prix (GNF)</label>
                <input
                  type="number"
                  name="price"
                  min="100000"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Équipements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id="wifi"
                    name="hasWifi"
                    checked={formData.hasWifi}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-primary focus:ring-primary"
                  />
                  <label htmlFor="wifi" className="ml-3 flex items-center">
                    <Wifi className="w-5 h-5 mr-2 text-gray-700" /> WiFi
                  </label>
                </div>
                <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id="clim"
                    name="hasClim"
                    checked={formData.hasClim}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-primary focus:ring-primary"
                  />
                  <label htmlFor="clim" className="ml-3 flex items-center">
                    <Snowflake className="w-5 h-5 mr-2 text-gray-700" /> Climatisation
                  </label>
                </div>
                <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id="tv"
                    name="hasTV"
                    checked={formData.hasTV}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-primary focus:ring-primary"
                  />
                  <label htmlFor="tv" className="ml-3 flex items-center">
                    <Tv className="w-5 h-5 mr-2 text-gray-700" /> Télévision
                  </label>
                </div>
                <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id="kitchen"
                    name="hasKitchen"
                    checked={formData.hasKitchen}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-primary focus:ring-primary"
                  />
                  <label htmlFor="kitchen" className="ml-3 flex items-center">
                    <Utensils className="w-5 h-5 mr-2 text-gray-700" /> Cuisine
                  </label>
                </div>
                <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id="parking"
                    name="parking"
                    checked={formData.parking}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-primary focus:ring-primary"
                  />
                  <label htmlFor="parking" className="ml-3 flex items-center">
                    <ParkingCircle className="w-5 h-5 mr-2 text-gray-700" /> Parking
                  </label>
                </div>
                <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id="extraBed"
                    name="extraBed"
                    checked={formData.extraBed}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-primary focus:ring-primary"
                  />
                  <label htmlFor="extraBed" className="ml-3 flex items-center">
                    <Bed className="w-5 h-5 mr-2 text-gray-700" /> Lit supplémentaire
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Étape 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Options et Galerie</h2>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Options disponibles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {option.map(opt => (
                  <div 
                    key={opt.id} 
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedOption.includes(opt.id) ? 'border-primary bg-primary/10' : 'hover:border-gray-300'}`}
                    onClick={() => handleSelectOption(opt.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`option_${opt.id}`}
                        name="option"
                        value={opt.id}
                        checked={selectedOption.includes(opt.id)}
                        onChange={() => handleSelectOption(opt.id)}
                        className="h-5 w-5 text-primary focus:ring-primary"
                      />
                      <div className="ml-3 flex items-center">
                        {opt.imageUrl && (
                          <Image 
                            src={opt.imageUrl} 
                            alt={opt.title} 
                            width={40} 
                            height={40} 
                            className="mr-2 rounded-md object-cover"
                          />
                        )}
                        <span className="text-gray-800">{opt.title}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Galerie d&apos;images</h3>
                <p className="text-sm text-gray-500 mb-4">Téléchargez au moins 4 images de votre établissement</p>
              </div>
              
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="text-gray-700 font-medium">Cliquez pour télécharger des images</span>
                <span className="text-sm text-gray-500 mt-1">Formats supportés: JPG, PNG (max 5MB par image)</span>
              </label>
              
              {/* Prévisualisation des images */}
              {imagePreviews.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Images sélectionnées ({imagePreviews.length}/4)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden">
                        <img 
                          src={preview} 
                          alt={`Preview ${index}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Précédent
            </button>
          ) : <div></div>}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={() => validateStep() && setStep(step + 1)}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création en cours...
                </span>
              ) : 'Créer le logement'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}