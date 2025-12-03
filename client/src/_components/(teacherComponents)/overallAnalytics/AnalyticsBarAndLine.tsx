"use client";

import * as React from "react";
import { LineChart, BarChart } from "@mui/x-charts";
import { Select, MenuItem } from "@mui/material";
import axios from "axios";
const API_URL =process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"; 
import { useUser } from "@clerk/clerk-react";

// ---------- TYPES ----------
interface MonthlyScore {
  month: string;
  avgScore: number;
  topClass: number;
  lowClass: number;
}

interface GradeDistribution {
  className: string;
  A: number;
  B: number;
  C: number;
}

const ChartSkeleton = () => (
  <div className="p-4 rounded-2xl box-bg border border-gray-700/40 animate-pulse">
    <div className="flex justify-between items-center mb-3">
      <div className="h-5 bg-gray-700/60 rounded w-1/3"></div>
      <div className="h-5 bg-gray-700/60 rounded w-16"></div>
    </div>
    <div className="h-4 bg-gray-700/60 rounded w-2/3 mb-6"></div>
    <div className="h-64 bg-gray-700/60 rounded-lg w-full"></div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
    <ChartSkeleton />
    <ChartSkeleton />
  </div>
);


// ---------- Line Chart Component ----------
const PerformanceTrendChart: React.FC<{ monthlyData: MonthlyScore[] }> = ({ monthlyData }) => {
  

  const currentMonthIndex = new Date().getMonth();

  const months = monthlyData.map((m) => m.month).slice(0, currentMonthIndex + 1);
  const avgScores = monthlyData.map((m) => m.avgScore).slice(0, currentMonthIndex + 1);
  const topScores = monthlyData.map((m) => m.topClass).slice(0, currentMonthIndex + 1);
  const lowScores = monthlyData.map((m) => m.lowClass).slice(0, currentMonthIndex + 1);




  return (
    <div className="p-4 rounded-2xl box-bg hover:border-slate-500 transition-all">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-white">Overall Monthly Performance</h3>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        Average performance trends of classrooms across months
      </p>

      <div className="w-full">
        <LineChart
          height={300}
          xAxis={[
            {
              data: months,
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
            { data: avgScores, label: "Overall Avg", color: "#027af2", showMark: true },
            { data: topScores, label: "Top Class", color: "#4ca6ff", showMark: true },
            { data: lowScores, label: "Lowest Class", color: "#0059b3", showMark: true },
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
          }}
        />
      </div>
    </div>
  );
};

// ---------- Bar Chart Component ----------
const GradeDistributionChart: React.FC<{ gradeData: GradeDistribution[] }> = ({ gradeData }) => {
  const totalClasses = gradeData.length;
  const classesPerPage = 5;

  const [page, setPage] = React.useState(0);
  const totalPages = Math.ceil(totalClasses / classesPerPage);

  const startIndex = page * classesPerPage;
  const visibleData = gradeData.slice(startIndex, startIndex + classesPerPage);

  return (
    <div className="p-4 rounded-2xl box-bg hover:border-slate-500">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-white">Grade Distribution by Class</h3>
          <p className="text-gray-400 text-sm">Number of students in each grade category</p>
        </div>

        {/* Pagination top-left dropdown */}
        <div className="flex items-center gap-2">
          <select
            aria-label="Select class page"
            value={page}
            onChange={(e) => setPage(parseInt(e.target.value, 10))}
            className="p-2 pl-4 cursor-pointer text-white bg-[#18181b] rounded-lg text-[0.9rem]"
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <option key={i} value={i}>
                Classes {i * classesPerPage + 1}–{Math.min((i + 1) * classesPerPage, totalClasses)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <BarChart
        height={360}
        xAxis={[
          {
            data: visibleData.map((d) => d.className),
            scaleType: "band",
            label: "Classes",
            tickLabelStyle: { fill: "#cbd5e1", fontSize: 12, textAnchor: "middle" },
          },
        ]}
        yAxis={[
          {
            min: 0,
            label: "Students",
            tickLabelStyle: { fill: "#cbd5e1", fontSize: 12 },
          },
        ]}
        series={[
          { data: visibleData.map((d) => d.A), label: "A (80–100%)", color: "#4ca6ff", stack: "total" },
          { data: visibleData.map((d) => d.B), label: "B (50–79%)", color: "#027af2", stack: "total" },
          { data: visibleData.map((d) => d.C), label: "C (other)", color: "#0059b3", stack: "total" },
        ]}
        margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
        grid={{ horizontal: true }}
        slotProps={{ tooltip: { trigger: "axis" } }}
        sx={{
          "& .MuiChartsAxis-tickLabel": { fill: "#ccc" },
          "& .MuiChartsAxis-line": { stroke: "#666", strokeWidth: 1.2 },
          "& .MuiChartsGrid-line": { stroke: "#333", strokeDasharray: "4" },
          "& .MuiChartsLegend-root": { color: "#ccc" },
          "& .MuiBarElement-root:hover": { opacity: 0.95, filter: "brightness(1.08)" },
        }}
      />
    </div>
  );
};

// ---------- Parent Wrapper ----------
const DashboardCharts: React.FC = () => {
  const [monthlyData, setMonthlyData] = React.useState<MonthlyScore[]>([]);
  const [gradeData, setGradeData] = React.useState<GradeDistribution[]>([]);
  const [loading, setLoading] = React.useState(true);
  const {user,isLoaded}=useUser();

  React.useEffect(() => {
    if(!isLoaded)
        return;
    
      const fetchAnalytics = async () => {
        
        try {
          const res = await axios.get(`${API_URL}/analytics/class/gradePerformance/${user?.id }`);

          const tmp=res.data as {msg:string, classData:any}
          console.log(tmp);
          const { classGradeDis, classMonthlySocre } = tmp.classData;

          setMonthlyData(classMonthlySocre);
          setGradeData(classGradeDis);
        } catch (err) {
          console.error("Failed to fetch analytics:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchAnalytics();
    }, [user]);

  

  if (!isLoaded || loading) {
    return <DashboardSkeleton />;
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      <PerformanceTrendChart monthlyData={monthlyData} />
      <GradeDistributionChart gradeData={gradeData} />
    </div>
  );
};

export default DashboardCharts;
