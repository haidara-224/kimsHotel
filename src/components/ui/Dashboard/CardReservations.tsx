import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { Progress } from "../progress";

interface CardReservationsProps {
    title?: string;
    count?: number;
    percentage?: number;
    icon: ReactNode;
}

export default function CardReservations({ title, count = 0, percentage = 0, icon }: CardReservationsProps) {
    return (
        <Card className="dark:bg-gray-500 border-slate-900 shadow-2xl text-slate-800 w-full p-4">
            <CardHeader>
                <CardTitle className="text-xl text-center">{title}</CardTitle>
                <CardDescription className="flex justify-center">{icon}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <p className="text-2xl font-bold">{count}</p>
                <Progress value={percentage} className="w-full mt-2  dark:bg-gray-700 border-blue-400" />
                <p className="text-sm mt-1">{percentage.toFixed(2)}%</p>
            </CardContent>
        </Card>
    );
}
