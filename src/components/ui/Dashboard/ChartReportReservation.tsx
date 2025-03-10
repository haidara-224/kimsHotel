"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { ReportReservationByMonth } from "@/app/(action)/Logement.action";

interface MonthlyData {
  month: string;
  confirmed: number;
  cancelled: number;
}

// Liste des mois (garantie d'affichage complet)
const MONTHS = [
  "Janv", "Fév", "Mars", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sept", "Oct", "Nov", "Déc"
];

export function MonthlyChart({ logementId }: { logementId: string }) {
  const [chartData, setChartData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const rawData = await ReportReservationByMonth(logementId);

      // Reformater les données
      const formattedData = rawData.map((d: { month: number; confirmed: number; cancelled: number }) => ({
        month: MONTHS[d.month - 1], // Convertir le numéro du mois en nom
        confirmed: d.confirmed || 0,
        cancelled: d.cancelled || 0
      }));

      // Vérifier que chaque mois est présent
      const completeData = MONTHS.map((month) => {
        const found = formattedData.find((d) => d.month === month);
        return found || { month, confirmed: 0, cancelled: 0 };
      });

      setChartData(completeData);
    }

    fetchData();
  }, [logementId]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>📊 Évolution Mensuelle des Réservations</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="confirmed"
              stroke="#008000"
              name="Confirmé ✅"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="cancelled"
              stroke="#FF0000"
              name="Annulé ❌"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
