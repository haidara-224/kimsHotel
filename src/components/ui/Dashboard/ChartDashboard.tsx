"use client";
import { useEffect, useState } from "react";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "../card";
import { getReservationsPerMonth } from "@/app/(action)/dashboard.action";

export function ChartDashboard() {
  const [data, setData] = useState<{ month: string; reservations: number }[]>([]);
  async function fetchData() {
    const reservations = await getReservationsPerMonth();
    setData(reservations);
  }

  useEffect(() => {
   
    fetchData();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analytics for the year</CardTitle>
        <CardDescription>Reservations per Month</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart width={1200} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              
              
              <Tooltip />
              <Line type="monotone" dataKey="reservations" stroke="#8884d8" strokeWidth={2} />
              <CartesianGrid stroke="#ccc"/>
              <XAxis dataKey="month" />
              <YAxis />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
