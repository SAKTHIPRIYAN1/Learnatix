"use client";

import React from "react";
import dynamic from "next/dynamic";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CircularProgress } from "@mui/material";

const LineChart = dynamic(
  () => import("@mui/x-charts/LineChart").then((mod) => mod.LineChart),
  { ssr: false }
);

const ClassroomOverviewCard: React.FC = () => {
  const data = [
    { title: "Total Students", value: "45", change: 18, chartData: [35, 40, 38, 42, 44, 45, 43, 45, 46, 45] },
    { title: "Average Class Score", value: "78%", change: -1, chartData: [67, 70, 68, 70, 73, 76, 73, 72, 64, 60] },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {data.map((item, i) => (
        <CountCardItem key={i} {...item} />
      ))}

      <div className="hover:border-slate-500 min-h-44 p-4 rounded-xl box-bg border border-gray-700/40 flex flex-col justify-between">
        <div>
          <p className="text-gray-100 font-semibold text-sm">Most Common Grade</p>
          <h3 className="text-2xl font-semibold text-white mt-2">A</h3>
          <span className="text-sm px-2 py-1 rounded-lg bg-blue-900/40 border border-blue-700 text-blue-400 font-medium mt-1 inline-block">
            42% students
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-3">Based on last 5 tasks</p>
      </div>

      <div className="hover:border-slate-500 min-h-44 p-4 rounded-xl box-bg border border-gray-700/40 flex flex-col items-center justify-center">
        <p className="text-gray-100 font-semibold text-sm mb-2">Task Completion Rate</p>
        <div className="relative flex items-center justify-center">
          <CircularProgress
            variant="determinate"
            value={92}
            size={70}
            thickness={4}
            sx={{
              color: "#22c55e",
              "& .MuiCircularProgress-circle": { strokeLinecap: "round" },
            }}
          />
          <span className="absolute text-lg font-semibold text-white">92%</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Last 30 days</p>
      </div>
    </div>
  );
};

interface CountCardItemProps {
  title: string;
  value: string;
  change: number;
  chartData: number[];
}

const CountCardItem: React.FC<CountCardItemProps> = ({
  title,
  value,
  change,
  chartData,
}) => {
  const gradientId = React.useId();

  const color =
    change > 10 ? "#22c55e" : change < 0 ? "#ef4444" : "#60a5fa";

  const bgColor =
    change > 10
      ? "bg-green-800/30 border-green-700 text-green-400"
      : change < 0
      ? "bg-red-800/30 border-red-700 text-red-400"
      : "bg-blue-800/30 border-blue-700 text-blue-400";

  const Icon = change > 10 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const changeText = `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;

  const minY = Math.min(...chartData);
  const maxY = Math.max(...chartData);

  return (
    <div className="hover:border-slate-500 min-h-44 p-4 rounded-xl box-bg border border-gray-700/40">
      <p className="text-gray-100 font-semibold text-sm">{title}</p>
      <div className="flex justify-between items-center mt-1">
        <h3 className="text-2xl font-semibold text-white">{value}</h3>
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-xl text-xs font-medium border ${bgColor}`}>
          <Icon className="w-3.5 h-3.5" />
          {changeText}
        </span>
      </div>
      <p className="text-xs mt-1 text-gray-400">Last 30 days</p>

      <div className="mt-4 h-16 w-full">
        <LineChart
          height={70}
          width={295}
          className="ml-[-32px]"
          series={[
            { data: chartData, color, area: true, curve: "linear", showMark: false },
          ]}
          yAxis={[{ min: minY, max: maxY }]}
          xAxis={[{ data: chartData.map((_, i) => i + 1), scaleType: "linear" }]}
          margin={{ top: 0, bottom: 5, left: 0, right: 0 }}
          grid={{ horizontal: false, vertical: false }}
          slotProps={{ tooltip: { trigger: "none" } }}
          sx={{
            "& .MuiChartsAxis-root": { display: "none" },
            "& .MuiChartsLegend-root": { display: "none" },
            "& .MuiAreaElement-root": { fill: `url(#${gradientId})` },
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.5} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
        </LineChart>
      </div>
    </div>
  );
};

export default ClassroomOverviewCard;
