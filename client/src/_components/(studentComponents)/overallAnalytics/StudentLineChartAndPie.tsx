"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import dynamic from "next/dynamic";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";

// Dynamic imports (charts client-side only)
const LineChart = dynamic(
  () => import("@mui/x-charts").then((mod) => mod.LineChart),
  { ssr: false }
);
const PieChart = dynamic(
  () => import("@mui/x-charts").then((mod) => mod.PieChart),
  { ssr: false }
);

// ---------- TYPES ----------
interface MonthlyScore {
  month: string;
  avgScore: number;
}

interface GradeDistribution {
  Exceptional: number;
  Proficient: number;
  Developing: number;
  Emerging: number;
  "Needs Attention": number;
}

interface StudentPerformanceGrade {
  monthlyScores: MonthlyScore[];
  gradeDistribution: GradeDistribution;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// =====================================================
// Chart Components
// =====================================================

const StudentPerformanceChart: React.FC<{ monthlyScores: MonthlyScore[] }> = ({
  monthlyScores,
}) => {
  const orderedMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Static but realistic demo graph data (still can come from backend)
  const yourAvg = [55, 62, 69, 73, 67, 67, 64, 68, 62, 65, 68, 71];
  const classAvg = [33, 38, 44, 48, 62, 68, 72, 75, 80, 83, 85, 88];
  const currentMonthIndex = new Date().getMonth();

  const labels = orderedMonths.slice(0, currentMonthIndex + 1);
  const yourData = yourAvg.slice(0, currentMonthIndex + 1);
  const classData = classAvg.slice(0, currentMonthIndex + 1);

  return (
    <div className="p-4 rounded-2xl box-bg hover:border-slate-500 border border-gray-700/40 transition-all">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-white">Year-to-Date Performance</h3>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        Your performance trend this year compared to class average.
      </p>

      <LineChart
        height={300}
        xAxis={[
          {
            data: labels,
            scaleType: "band",
            tickLabelStyle: { fill: "#cbd5e1", fontSize: 12 },
          },
        ]}
        yAxis={[
          {
            min: 0,
            max: 100,
            tickLabelStyle: { fill: "#cbd5e1", fontSize: 12 },
          },
        ]}
        series={[
          {
            data: yourData,
            label: "Your Average",
            color: "#4ca6ff",
            showMark: true,
          },
          {
            data: classData,
            label: "Class Average",
            color: "#0059b3",
            showMark: true,
          },
        ]}
        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        grid={{ horizontal: true, vertical: false }}
        slotProps={{
          legend: {
            direction: "horizontal",
            position: { vertical: "top", horizontal: "center" },
          },
          tooltip: { trigger: "axis" },
        }}
        sx={{
          "& .MuiChartsLegend-root": { color: "#e5e7eb" },
          "& .MuiChartsAxis-line": { stroke: "#475569" },
          "& .MuiChartsGrid-line": { stroke: "#334155", strokeDasharray: "4" },
          "& .MuiChartsAxis-tickLabel": { fill: "#cbd5e1" },
        }}
      />
    </div>
  );
};


const StudentGradeChart: React.FC<{ gradeDistribution: GradeDistribution }> = ({
  gradeDistribution,
}) => {
  const gradeData = Object.entries(gradeDistribution).map(
    ([name, value], idx) => ({
      name,
      value,
      color: ["#0059b3", "#027af2", "#4ca6ff", "#7dc8ff", "#a4d8ff"][idx],
    })
  );

  const totalTasks = gradeData.reduce((acc, g) => acc + g.value, 0);

  return (
    <div className="box-bg hover:border-slate-500 transition-all rounded-xl p-4 shadow-md relative flex flex-col justify-end">
      <h3 className="font-semibold text-zinc-100 mb-1 text-lg">
        Performance Grade Distribution
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Proportion of tasks in each grade band
      </p>

      <div className="flex justify-center relative">
        <PieChart
          height={230}
          series={[
            {
              data: gradeData.map((g) => ({
                label: g.name,
                value: g.value,
                color: g.color,
              })),
              innerRadius: 80,
              outerRadius: 100,
              paddingAngle: 2,
              cornerRadius: 3,
              highlightScope: { fade: "global", highlight: "item" },
              faded: {
                innerRadius: 70,
                additionalRadius: -10,
                color: "#3f3f46",
              },
            },
          ]}
          slotProps={{
            legend: { position: { vertical: "bottom", horizontal: "center" } },
          }}
          sx={{
            "& .MuiChartsLegend-root": { display: "none" },
            "& .MuiChartsTooltip-root": {
              color: "#fff",
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "6px",
              padding: "6px 10px",
            },
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-zinc-100">
            {totalTasks}
          </span>
          <span className="text-sm text-zinc-400">Total Tasks</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {gradeData.map((g) => (
          <div
            key={g.name}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-2"
          >
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: g.color }}
              ></span>
              <span>{g.name}</span>
            </div>

            <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  backgroundColor: g.color,
                  width: `${(g.value / totalTasks) * 100}%`,
                }}
              />
            </div>

            <span className="text-sm font-medium text-zinc-300">
              {((g.value / totalTasks) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// Skeleton Loader
// =====================================================

const StudentAnalyticsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-pulse">
    <div className="p-4 rounded-2xl box-bg border border-gray-700/40">
      <Skeleton variant="text" width={180} height={24} sx={{ bgcolor: "#1f2937" }} />
      <Skeleton variant="text" width="60%" height={16} sx={{ bgcolor: "#1f2937" }} />
      <Skeleton variant="rectangular" height={260} sx={{ bgcolor: "#1f2937", mt: 2 }} />
    </div>

    <div className="p-4 rounded-2xl box-bg border border-gray-700/40">
      <Skeleton variant="text" width={200} height={24} sx={{ bgcolor: "#1f2937" }} />
      <Skeleton variant="text" width="70%" height={16} sx={{ bgcolor: "#1f2937" }} />
      <Skeleton variant="circular" width={180} height={180} sx={{ bgcolor: "#1f2937", mx: "auto", mt: 4 }} />
      <Skeleton variant="text" width="80%" height={12} sx={{ bgcolor: "#1f2937", mx: "auto", mt: 3 }} />
      <Skeleton variant="text" width="60%" height={12} sx={{ bgcolor: "#1f2937", mx: "auto" }} />
    </div>
  </div>
);

// =====================================================
// Parent Component
// =====================================================

const StudentPerformanceAndGradeComp: React.FC = () => {
  const [data, setData] = useState<StudentPerformanceGrade | null>(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/analytics/student/gradePerformance/${user.id}`
        );
        const fetched = res.data as {
          msg: string;
          studentPerformanceData: StudentPerformanceGrade;
        };
        setTimeout(() => setData(fetched.studentPerformanceData), 600); // slight delay for smooth loading
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || "Error fetching analytics data");
      }
    };

    fetchData();
  }, [user, isLoaded]);

  if (!isLoaded || !data) return <StudentAnalyticsSkeleton />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 transition-opacity duration-500 opacity-100">
      <StudentPerformanceChart monthlyScores={data.monthlyScores} />
      <StudentGradeChart gradeDistribution={data.gradeDistribution} />
    </div>
  );
};

export default StudentPerformanceAndGradeComp;
