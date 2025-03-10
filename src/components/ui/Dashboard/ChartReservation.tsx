/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { RepportReservation } from "@/app/(action)/Logement.action";
import { TrendingUp } from "lucide-react";

// Interface des données
interface ChartData {
  reservation: string;
  visitors: number;
  fill?: string;
}

// Couleurs et labels
const localChartConfig: { [key: string]: { label: string; color: string } } = {
  PENDING: { label: "En Attente", color: "#f59e0b" },
  CONFIRMÉ: { label: "Confirmé", color: "#10b981" },
  CANCELLED: { label: "Annulé", color: "#ef4444" },
};

// Custom Tooltip (sans fond gris moche)
const CustomTooltip = ({ active, payload }:any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-lg px-3 py-2 border border-gray-200 text-sm text-gray-700">
        <p className="font-semibold">{localChartConfig[payload[0].payload.reservation].label}</p>
        <p>{payload[0].value} visiteurs</p>
      </div>
    );
  }
  return null;
};

export function ChartReservation({ logementId }: { logementId: string }) {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await RepportReservation(logementId);
      if (data) {
        const enrichedData = data.map((item: ChartData) => ({
          ...item,
          fill: localChartConfig[item.reservation]?.color,
        }));
        setChartData(enrichedData);
      }
    }
    fetchData();
  }, [logementId]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Rapport de Réservations</CardTitle>
        <CardDescription className="text-sm">KimsHotel</CardDescription>
      </CardHeader>

      <CardContent className="h-[300px]"> {/* Suppression du flex-1 */}
        {chartData.length === 0 ? (
          <div className="text-gray-500 text-sm">Aucune donnée disponible</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
           <BarChart
  data={chartData}
  margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
  barCategoryGap={1000} // Espace entre les barres
>
  <CartesianGrid strokeDasharray="3 3" vertical={false} />
  <XAxis
    dataKey="reservation"
    tick={{ fontSize: 12 }}
    tickLine={false}
    axisLine={{ stroke: "#ddd" }}
    padding={{ left: 20, right: 20 }}
  />
  <YAxis
    tick={{ fontSize: 0 }}
    tickLine={false}
    domain={[0, "auto"]} // Ajuste la hauteur max des barres automatiquement
  />
  <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
  <Bar dataKey="visitors" radius={[5, 5, 0, 0]} barSize={40}> {/* Largeur des barres */}
    {chartData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.fill} />
    ))}
    <LabelList
      dataKey="visitors"
      position="top"
      style={{ fontSize: 15, fill: "#333" }} // Taille du texte réduite
    />
  </Bar>
</BarChart>


          </ResponsiveContainer>
        )}
      </CardContent>

      <CardContent className="pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          Répartition des statuts de réservation
        </div>
      </CardContent>
    </Card>
  );
}
