import { Logement } from "@/types/types"
import Image from "next/image";
interface logementProps {
    logement: Logement
}
export function OptionLogement({ logement }: logementProps) {
    return (
        <>
        
                {logement.logementOptions.map((opt) => (
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
                                className="w-6 h-6 object-contain opacity-80 group-hover:opacity-100 transition-opacity dark:bg-white"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">{opt.option.title}</p>
                            <p className="text-xs text-muted-foreground">{opt.option.description}</p>
                        </div>
                    </div>
                ))}
            </>
    )
}