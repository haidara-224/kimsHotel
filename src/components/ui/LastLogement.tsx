'use client'
import { Logement } from "@/types/types";
import { Card, CardFooter } from "./card";
import Image from "next/image";
import { Button } from "./button";
import { useEffect, useState } from "react";
import { GetLastLogement } from "@/app/(action)/home.action";
import Link from "next/link";

// Spinner CSS (Simple Circle Spinner)
const spinnerStyle = {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 2s linear infinite",
};

const adventureDestinations = [
    {
        id: 1,
        name: "Hiking",
        location: "Switzerland",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQItzaTmjxxCz5Z91tvxu8mJvNalBj1ECReVg&s",
    },
    {
        id: 2,
        name: "Camping",
        location: "Norway",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHvvk4IR-x_g9VYXLQJUtSbhdM6J5zFVuC-Q&s",
    },
    {
        id: 3,
        name: "Diving",
        location: "Great Barrier Reef",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBU4eUENe6f2dAFnO3JkuUsJObMdnXbkdDxA&s",
    },
];

export function LastLogement() {
    const [logement, setLogement] = useState<Logement[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchLastLogement() {
        setIsLoading(true);
        try {
            const data = await GetLastLogement();
            setLogement(data as Logement[]);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchLastLogement();
    }, []);

    if (isLoading) {

        return (
            <div className="flex justify-center items-center h-64 w-full">
                <div style={spinnerStyle}></div>
            </div>
        );
    }

    if (logement.length < 1) {
        return (
            <>
                {adventureDestinations.map((dest) => (
                    <Card key={dest.id} className="overflow-hidden group">
                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src={dest.image}
                                alt={dest.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                layout="fill"
                                objectFit="cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                <h3 className="font-semibold text-lg text-white">{dest.name}</h3>
                                <p className="text-sm text-gray-200">{dest.location}</p>
                            </div>
                        </div>
                        <CardFooter className="p-4">
                            <Button variant="outline" className="w-full">
                                View Details
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </>
        );
    }

    return (
        <>
            {logement.map((lg) => (
                <Card key={lg.id} className="overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                        {lg.images.length > 0 && (
                            <Image
                                key={lg.images[0].id}
                                src={lg.images[0].urlImage}
                                alt={lg.nom}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                layout="fill"
                                objectFit="cover"
                            />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                            <h3 className="font-semibold text-lg text-white">{lg.nom}</h3>
                            <p className="text-sm text-gray-200">{lg.adresse}</p>
                        </div>
                    </div>
                    <CardFooter className="p-4">
                        <Link
                            href={`/views/appartement/${lg.id}`}
                            passHref
                            className="w-full"
                        >
                            <Button className="w-full">
                                Consulter
                            </Button>
                        </Link>
                    </CardFooter>

                </Card>
            ))}
        </>
    );
}
