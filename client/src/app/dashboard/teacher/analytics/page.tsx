"use client";

import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import DashboardCharts from "@/_components/(teacherComponents)/AnalyticsBarAndTable";
import ChartComp2 from "@/_components/(teacherComponents)/AnalyticsLineAndBar";

// ---------- Main Analytics Page ----------
const AnalyticsPage: React.FC = () => {
  return (
    <div className="w-full pr-6">
      <h2 className="text-xl font-semibold mb-4">Overview</h2>

      {/* ---------- Top Section ---------- */}
      <div className="w-full">
        <CountCards />
      </div>

      {/* ---------- Bottom Charts ---------- */}
      <div className="w-full">
        <DashboardCharts />
      </div>

      <div className="w-full">
        <ChartComp2 />
      </div>
    </div>
  );
};

export default AnalyticsPage;

// ---------- Count Cards Section ----------
const CountCards: React.FC = () => {
  // This array drives everything dynamically
  const data = [
    {
      title: "Total Active Classrooms",
      value: "8",
      change: 12, // +12% increase
      chartData: [10, 12, 14, 13, 16, 18, 22, 26, 28],
    },
    {
      title: "Total Students Taught",
      value: "156",
      change: -5, // -5% decline
      chartData: [60, 58, 56, 54, 52, 50, 48, 45],
    },
    {
      title: "Avg Task Completion Rate",
      value: "87%",
      change: 5, // neutral
      chartData: [120, 125, 123, 130, 140, 138, 137],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {data.map((item, i) => (
        <CountCardItem key={i} {...item} />
      ))}

      {/* Insight Card */}
      <div className="min-h-44 p-4 rounded-xl box-bg">
        <h3 className="text-lg font-semibold text-white">
          Explore your data
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Uncover classroom performance and task insights instantly.
        </p>
        <button className="mt-4 bg-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition">
          Get insights
        </button>
      </div>
    </div>
  );
};

// ---------- Individual Count Card ----------
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

  // determine colors dynamically
  const color =
    change > 10
      ? "#22c55e" // green
      : change < 0
      ? "#ef4444" // red
      : "#94a0b8"; // neutral blue

  const bgColor =
    change > 10
      ? "bg-green-800/30 border-green-700 text-green-400"
      : change < 0
      ? "bg-red-800/30 border-red-700 text-red-400"
      : "bg-neutral-800/30 border-neutral-700 text-neutral-400";

  const Icon =
    change > 10 ? TrendingUp : change < 0 ? TrendingDown : Minus;

  const changeText =
    change > 10
      ? `+${(change).toFixed(1)}%`
      : change < 0
      ? `${(change).toFixed(1)}%`
      : `${(change).toFixed(1)}%`

  return (
    <div className="min-h-44 p-4 rounded-xl box-bg border border-gray-700/40">
      <p className="text-gray-100 font-semibold text-sm">{title}</p>

      <div className="flex justify-between items-center mt-1">
        <h3 className="text-2xl font-semibold text-white">{value}</h3>
        <span
          className={`flex items-center gap-1 px-2 py-0.5 rounded-xl text-xs font-medium border ${bgColor}`}
        >
          <Icon className="w-3.5 h-3.5" />
          {changeText}
        </span>
      </div>

      <p className="text-xs mt-1 text-gray-400">Last 30 days</p>

      <div className="mt-4 h-10">
        <LineChart
          series={[
            {
              data: chartData,
              showMark: false,
              area: true,
              color,
            },
          ]}
          height={40}
          margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
          slotProps={{ tooltip: { trigger: "none" } }}
          sx={{
            "& .MuiAreaElement-root": {
              fill: `url(#${gradientId})`,
            },
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
        </LineChart>
      </div>
    </div>
  );
};
