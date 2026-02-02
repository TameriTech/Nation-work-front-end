"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface StatusData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface StatusDistributionChartProps {
  data: StatusData[];
  total: number;
}

export const StatusDistributionChart = ({
  data,
  total,
}: StatusDistributionChartProps) => {
  return (
    <Card className="h-full w-full bg-white rounded-[30px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-800">
          Répartition des statuts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap text-gray-500 gap-x-4 gap-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-sm">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-400">
                {item.name} - {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="relative mx-auto h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-400">Total Services</span>
            <span className="text-2xl font-bold">{total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
