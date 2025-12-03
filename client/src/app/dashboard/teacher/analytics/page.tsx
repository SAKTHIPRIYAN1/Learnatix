"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import DashboardCharts from "@/_components/(teacherComponents)/overallAnalytics/AnalyticsBarAndLine";
import ClassPerformanceDashboard from "@/_components/(teacherComponents)/overallAnalytics/AnalyticsTableAndPie";
import dynamic from "next/dynamic";
import { useEffect,useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Dynamically import LineChart (client-side only)
const LineChart = dynamic(
  () => import("@mui/x-charts/LineChart").then((mod) => mod.LineChart),
  { ssr: false }
);

// ---------- Main Analytics Page ----------
const AnalyticsPage: React.FC = () => {
  return (
    <div className="w-full pr-6">
      <h2 className="text-xl font-semibold mb-4">Overview</h2>

      {/* ---------- Top Section ---------- */}
      <div className="w-full">
        <ClassCountCard />
      </div>

      {/* ---------- Bottom Charts ---------- */}
      <div className="w-full">
        <DashboardCharts />
      </div>

      <div className="w-full">
        <ClassPerformanceDashboard />
      </div>
    </div>
  );
};

export default AnalyticsPage;


interface ClassCountData {
  totalActiveClassRoom: number;
  totalStudent: number;
  avgScore: number;
}

type CountType = {
  title: string;
  value: string;
  change: number;
  chartData: number[];
};

// ---------- Skeleton Loader ----------
const SkeletonCard = () => (
  <div className="min-h-44 p-4 rounded-xl box-bg border border-gray-700/40 animate-pulse">
    <div className="h-4 bg-gray-700/60 rounded w-1/3 mb-4"></div>
    <div className="flex justify-between items-center mb-3">
      <div className="h-6 bg-gray-700/60 rounded w-1/4"></div>
      <div className="h-5 bg-gray-700/60 rounded w-1/5"></div>
    </div>
    <div className="h-3 bg-gray-700/60 rounded w-1/3 mb-3"></div>
    <div className="h-16 bg-gray-700/60 rounded w-full"></div>
  </div>
);

// ---------- Main Component ----------
const ClassCountCard: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [countData, setCountData] = useState<CountType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClassCountData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/analytics/class/countCard/${user?.id}`
      );
      const data = res.data as {
        msg: string;
        classCountData: ClassCountData;
      };

      const { totalActiveClassRoom, totalStudent, avgScore } =
        data.classCountData;

      setCountData([
        {
          title: "Total Active Classrooms",
          value: `${totalActiveClassRoom}`,
          change: 12,
          chartData: [60, 70, 80, 90, 85, 88, 95, 100, 110, 120],
        },
        {
          title: "Total Students Taught",
          value: `${totalStudent}`,
          change: -3,
          chartData: [150, 140, 130, 135, 125, 120, 115, 118, 122, 125],
        },
        {
          title: "Avg Task Completion Rate",
          value: `${avgScore.toFixed(2)}%`,
          change: 5,
          chartData: [80, 82, 85, 83, 84, 86, 88, 87, 89, 90],
        },
      ]);
    } catch (err) {
      console.error(err);
      const errMsg = err as { message?: string };
      toast.error(errMsg.message || "Error fetching analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded || !user?.id) return;
    fetchClassCountData();
  }, [isLoaded, user]);

  const showSkeleton = loading || !isLoaded;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {showSkeleton
        ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        : countData.map((item, i) => <CountCardItem key={i} {...item} />)}

      {/* Insight Card */}
      <div className="min-h-44 p-4 rounded-xl box-bg border border-gray-700/40">
        <h3 className="text-lg font-semibold text-white">Explore your data</h3>
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
const CountCardItem: React.FC<CountType> = ({
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

  const changeText =
    change > 10 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;

  const minY = Math.min(...chartData);
  const maxY = Math.max(...chartData);

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
          width={320}
          className="ml-[-60px]"
          series={[
            {
              data: chartData,
              color,
              area: true,
              curve: "linear",
              showMark: false,
            },
          ]}
          yAxis={[{ min: minY, max: maxY }]}
          xAxis={[{ data: chartData.map((_, i) => i + 1) }]}
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
