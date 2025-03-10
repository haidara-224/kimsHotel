import {  LucideIcon } from "lucide-react";
import { Card, CardContent } from "../card";
import React from "react";
interface  DashboardCardPrpos {
    title:string,
    count:number,
    icon:React.ReactElement<LucideIcon>
}
export function DashboardCard({title, count,icon}:DashboardCardPrpos){
    return (
        <Card className="bg-slate-100 dark:bg-slate-800 p-4">
            <CardContent className="flex flex-col items-center">
                <h3 className="text-xl text-center mb-4 font-bold text-slate-500 dark:text-slate-200">{title}</h3>
                <div className="flex gap-5 flex-col justify-center items-center">
            {icon}
                <h3 className="text-2xl font-semibold text-slate-500 dark:text-slate-200">
                    {count}
                </h3>
                </div>
            </CardContent>
        </Card>
    )
}