import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { Progress } from "../progress"; 

interface LogementCardProps {
    title: string;
    children: ReactNode;
    icon: ReactNode;
    progress?: number;
}

export function DetailsCardLogement({ title, icon, children, progress }: LogementCardProps) {
    return (
        <Card className="dark:bg-white border-slate-900 shadow-2xl text-slate-800 w-full">
            <CardHeader>
                <CardTitle className="text-xl text-center">{title}</CardTitle>
                <CardDescription className="flex justify-center text-2xl" >{icon}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
                {progress !== undefined && (
                    <div className="mt-4">
                        <Progress value={progress} className="h-3 dark:bg-gray-700 border-blue-400" />
                        <p className="text-center mt-1 text-sm">{progress.toFixed(1)}%</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
