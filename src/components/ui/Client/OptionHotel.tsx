
import { Hotele } from "@/types/types";
import { ParkingCircle } from "lucide-react";
import Image from "next/image";
interface HotelProps {
    hotel: Hotele
}
export function OptionHotel({ hotel }: HotelProps) {
    return (
        <>
        
                {hotel.hotelOptions.map((opt) => (
                    <div
                        key={opt.option.id}
                        className="group flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/80 transition-all duration-300 border hover:border-primary/20 cursor-pointer"
                    >
                        <div className="p-2 rounded-lg bg-background border">
                            <Image
                                src={opt.option.imageUrl}
                                alt={opt.option.title}
                                width={32}
                                height={32}
                                className="w-6 h-6 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">{opt.option.title}</p>
                            <p className="text-xs text-muted-foreground">{opt.option.description}</p>
                        </div>
                    </div>
                ))}
                <div
                    
                        className="group flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/80 transition-all duration-300 border hover:border-primary/20 cursor-pointer"
                    >
                        {hotel.parking && (
                            <>
                                <div className="p-2 rounded-lg bg-background border">
                                    <ParkingCircle/>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">Parking</p>
                                </div>
                            </>
                        )}
                       
                    </div>
            </>
    )
}