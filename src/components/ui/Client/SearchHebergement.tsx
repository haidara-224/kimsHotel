/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, PanInfo } from 'framer-motion'
import { Hotel, Home, MapPin,  Star, ChevronRight, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { homeTypes } from '@/types/types'
import { SearchHebergement } from '@/app/(action)/home.action'
interface PropsSearch{
    destination:string
}                    

const ImageCarousel = ({ images, id }: { images: { urlImage: string }[], id: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 50) {
      goToPrev()
    } else if (info.offset.x < -50) {
      goToNext()
    }
  }

  const goToNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToPrev = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <div className="relative h-64 w-full overflow-hidden" ref={containerRef}>
      <motion.div
        drag="x"
        dragConstraints={containerRef}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex h-full"
      >
        {images.map((image, index) => (
          <motion.div
            key={`${id}-${index}`}
            className="relative h-full w-full flex-shrink-0"
            animate={{ opacity: currentIndex === index ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={image.urlImage}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </motion.div>
        ))}
      </motion.div>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={`dot-${id}-${index}`}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${currentIndex === index ? 'bg-white w-4' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function SearchResults({destination}:PropsSearch) {
  const [hebergements, setHebergements] = useState<homeTypes[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'hotel' | 'logement'>('all')

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await SearchHebergement(destination)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hotels: homeTypes[] = data.hotels.map((hotel: any) => ({
        ...hotel,
        type: 'hotel',
        price: hotel.price ?? 0,
        chambres: hotel.chambres ?? [],
        hotelOptions: hotel.hotelOptions ?? [],
      }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const logements: homeTypes[] = data.logements.map((logement: any) => ({
        ...logement,
        type: 'logement',
        price: logement.price ?? 0,
        chambres: logement.chambres ?? [],
        hotelOptions: logement.hotelOptions ?? [],
      }))
      const all: homeTypes[] = [...hotels, ...logements]
      setHebergements(all)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [destination])


  const filteredResults = hebergements.filter(h => 
    filter === 'all' || h.type === filter
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Résultats de recherche
        </h1>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <MapPin className="w-5 h-5 mr-1" />
          <span>Conakry, Guinée</span>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
        >
          Tous
        </button>
        <button
          onClick={() => setFilter('hotel')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 ${filter === 'hotel' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
        >
          <Hotel className="w-5 h-5" /> Hôtels
        </button>
        <button
          onClick={() => setFilter('logement')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 ${filter === 'logement' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
        >
          <Home className="w-5 h-5" /> Appartements
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-96 animate-pulse" />
          ))}
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredResults.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <ImageCarousel images={item.images} id={item.id} />
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{item.nom}</h3>
                      <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {item.adresse}
                      </p>
                    </div>
                    {item.type === 'logement' && item.price && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">À partir de</p>
                        <p className="font-bold text-blue-600">
                          {item.price.toLocaleString('fr-FR')} GNF
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {item.type === 'hotel' && item.etoils && (
                        <div className="flex items-center text-yellow-500">
                          <Star className="fill-current w-4 h-4" />
                          <span className="ml-1 text-sm">{item.etoils}</span>
                        </div>
                      )}
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {item.type === 'hotel' ? 'Hôtel' : 'Appartement'}
                      </span>
                    </div>
                    
                    <Link
                      href={item.type=="logement" ?
                        `/views/appartement/${item.id}`
                        : `/views/hotel/${item.id}`
                      }
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      Voir <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12">
          <Hotel className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">Aucun résultat trouvé</h3>
          <p className="mt-1 text-gray-500">Essayez de modifier vos critères</p>
        </div>
      )}
    </div>
  )
}