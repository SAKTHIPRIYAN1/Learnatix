// ---------- Student Count Cards Section ----------


import { LineChart } from "@mui/x-charts/LineChart";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import React from "react";

const StudentCountCard: React.FC = () => {
  const data = [
    {
      title: "Total Active Classes",
      value: "5",
      change: 18,
      chartData: [25, 30, 30, 27, 32, 29, 35, 33, 40, 45], 
    },
    {
      title: "Total Tasks Submitted",
      value: "42",
      change: -5,
      chartData: [35, 38, 36, 37, 32, 34, 35, 30, 28, 25], 
    },
    {
      title: "Avg Score Across Tasks",
      value: "82%",
      change: 5,
      chartData: [32, 30, 32, 32, 33, 33, 32, 33, 33, 33], 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {data.map((item, i) => (
        <CountCardItem key={i} {...item} />
      ))}

      {/* Insight Card */}
      <div className="min-h-44 p-4 rounded-xl box-bg border border-gray-700/40">
        <h3 className="text-lg font-semibold text-white">Explore Your Progress</h3>
        <p className="text-gray-400 text-sm mt-1">
          Dive deeper into your learning insights and task performance.
        </p>
        <button className="mt-4 bg-blue-600 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition">
          View Insights
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

  const color =
    change > 10
      ? "#22c55e"
      : change < 0
      ? "#ef4444" 
      : "#60a5fa"; 

  const bgColor =
    change > 10
      ? "bg-green-800/30 border-green-700 text-green-400"
      : change < 0
      ? "bg-red-800/30 border-red-700 text-red-400"
      : "bg-blue-800/30 border-blue-700 text-blue-400";

  const Icon = change > 10 ? TrendingUp : change < 0 ? TrendingDown : Minus;

  const changeText =
    change > 10
      ? `+${change.toFixed(1)}%`
      : change < 0
      ? `${change.toFixed(1)}%`
      : `${change.toFixed(1)}%`;


  const minY = Math.min(...chartData);
  const maxY = Math.max(...chartData);
  const domain = [minY, maxY];

  return (
    <div className="hover:border-slate-500 min-h-44 p-4 rounded-xl box-bg border border-gray-700/40">
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

      <div className="mt-4 h-16 w-full">
        <LineChart
          height={70}
          width={340}
          className="ml-[-80px]"
          series={[
            {
              data: chartData,
              color,
              area: true,
              curve: "linear", 
              showMark: false,
            },
          ]}
          yAxis={[
            {
              min: domain[0],
              max: domain[1],
            },
          ]}
          xAxis={[
            {
              data: chartData.map((_, i) => i + 1),
              scaleType: "linear",
            },
          ]}
          margin={{ top: 0, bottom: 5, left: 0, right: 0 }}
          grid={{ horizontal: false, vertical: false }}
          slotProps={{ tooltip: { trigger: "none" } }}
          sx={{
            "& .MuiChartsAxis-root": { display: "none" },
            "& .MuiChartsLegend-root": { display: "none" },
            "& .MuiAreaElement-root": {
              fill: `url(#${gradientId})`,
            },
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

export default StudentCountCard;
