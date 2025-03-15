'use client'
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../carousel";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "../button";
import { useRouter } from "next/navigation";


interface getPropsHome {
    nom: string;
    type: string;
    adresse: string;
    prix?: number;
    urlImage: string[];
}

export default function ListinCardHome({ nom, type, adresse, urlImage, prix }: getPropsHome) {
        const router=useRouter()
    return (
        <div className="overflow-hidden duration-300">
            <div className="relative h-72 w-full overflow-hidden">
                {urlImage.length > 1 ? (
                    <Carousel className="w-full h-full">
                        <CarouselContent className="w-full h-72">
                            {urlImage.map((src, index) => (
                                <CarouselItem key={index} className="relative w-full h-72">
                                    <div className="relative w-full h-72">
                                        <Image
                                        onClick={() => router.push('/type-etablissement')}
                                            alt={`Image ${index + 1}`}
                                            src={src}
                                            fill
                                            className="object-cover transition-transform duration-200 hover:scale-105 rounded-xl cursor-pointer"
                                        />
                                        <div className="absolute top-3 left-3">
                                        <Button className="dark:bg-slate-900"><Heart className="text-white" /></Button>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full" />
                        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full" />
                    </Carousel>
                ) : (
                    <div className="relative h-72 w-full">
                        <Image
                            alt="Image house"
                            onClick={() => router.push('/type-etablissement')}
                            src={urlImage.length > 0 ? urlImage[0] : "/imgd.jpg"}
                            fill
                            className="object-cover transition-transform duration-200 hover:scale-105 rounded-xl cursor-pointer"
                        />
                        <div className="absolute top-3 left-3">
                            <Button className="dark:bg-slate-900"><Heart className="text-white" /></Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                    <h1 className="text-sm font-semibold text-gray-900 dark:text-white">{nom}</h1>
                    <span className="text-sm text-gray-500 dark:text-white">{type}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-white">{adresse}</p>
                {
                    prix ? <p className="text-sm text-gray-500">{prix} GNF par nuit</p>
                        : <Link href='/' className="text-blue-500 dark:text-blue-200">voir prix..</Link>
                }
            </div>
        </div>
    );
}
