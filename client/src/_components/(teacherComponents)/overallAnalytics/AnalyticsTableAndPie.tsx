"use client";

import * as React from "react";
import axios from "axios";
import { ChevronDown, ChevronRight, ChevronLeft, ChevronUp } from "lucide-react";
import { PieChart } from "@mui/x-charts";
import { useUser } from "@clerk/clerk-react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const ClassPerformanceDashboard = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("Top Performing");
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [pieData, setPieData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { user, isLoaded } = useUser();

  React.useEffect(() => {
    if (!isLoaded) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/analytics/class/tablePie/${user?.id}`);
        const tmp = res.data as { msg: string; classData: any };
        const { performanceData, tableData } = tmp.classData;
        setPieData(performanceData);
        setTableData(tableData);
      } catch (err) {
        console.error("Failed to fetch class analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen px-0 p-6 text-zinc-100">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-stretch">
        {/* LEFT SECTION */}
        {loading ? (
          <PerformanceTableSkeleton />
        ) : (
          <PerformanceTable selectedCategory={selectedCategory} allData={tableData} />
        )}

        {/* RIGHT SECTION */}
        <div className="flex flex-col justify-between gap-6 h-full">
          {loading ? (
            <CategoryTreeSkeleton />
          ) : (
            <CategoryTree
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          )}

          {loading ? <GradeDistributionSkeleton /> : <GradeDistributionChart pieData={pieData} />}
        </div>
      </div>
    </div>
  );
};

export default ClassPerformanceDashboard;

/* ---------------- SKELETON COMPONENTS ---------------- */
/* ---------- Shared Skeleton Loader Components ---------- */

const PerformanceTableSkeleton = () => (
  <div className="min-h-64 p-4 rounded-xl box-bg border border-gray-700/40 animate-pulse">
    <div className="h-4 bg-gray-700/60 rounded w-1/3 mb-4"></div>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex justify-between items-center mb-3">
        <div className="h-4 bg-gray-700/60 rounded w-1/4"></div>
        <div className="h-4 bg-gray-700/60 rounded w-1/5"></div>
        <div className="h-4 bg-gray-700/60 rounded w-1/6"></div>
        <div className="h-4 bg-gray-700/60 rounded w-1/6"></div>
        <div className="h-4 bg-gray-700/60 rounded w-1/6"></div>
      </div>
    ))}
  </div>
);

const GradeDistributionSkeleton = () => (
  <div className="min-h-64 p-4 rounded-xl box-bg border border-gray-700/40 animate-pulse flex flex-col items-center">
    <div className="h-4 bg-gray-700/60 rounded w-1/3 mb-4 self-start"></div>
    <div className="h-48 w-48 bg-gray-700/60 rounded-full mb-6"></div>
    <div className="w-full flex flex-col gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-3 w-3 bg-gray-700/60 rounded-full"></div>
          <div className="h-3 w-24 bg-gray-700/60 rounded"></div>
          <div className="flex-1 h-2 bg-gray-700/60 rounded"></div>
          <div className="h-3 w-10 bg-gray-700/60 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const CategoryTreeSkeleton = () => (
  <div className="min-h-48 p-4 rounded-xl box-bg border border-gray-700/40 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-4 bg-gray-700/60 rounded w-1/3"></div>
      <div className="h-4 bg-gray-700/60 rounded w-1/5"></div>
    </div>
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-6 bg-gray-700/60 rounded w-full"></div>
      ))}
    </div>
  </div>
);

/* ---------------- TABLE COMPONENT ---------------- */
const PerformanceTable: React.FC<{
  selectedCategory: string;
  allData: {
    className: string;
    totalStudents: number;
    avgScore: number;
    improvement: number;
    compRate: number;
    activeTasks: number;
  }[];
}> = ({ selectedCategory, allData }) => {
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 10;

  const getFilteredData = React.useCallback(() => {
    switch (selectedCategory) {
      case "Top Performing":
        return [...allData].sort((a, b) => b.avgScore - a.avgScore);
      case "Least Performing":
        return [...allData].sort((a, b) => a.avgScore - b.avgScore);
      case "Most Improved":
        return [...allData].sort((a, b) => b.improvement - a.improvement);
      default:
        return allData;
    }
  }, [selectedCategory, allData]);

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="hover:border-slate-500 transition-all box-bg rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="flex justify-between items-center border-b border-zinc-800 p-4">
        <h2 className="text-lg font-semibold text-zinc-100">
          {selectedCategory} Classrooms
        </h2>

        {/* Pagination control top-left */}
        <div className="flex gap-2 items-center text-sm text-zinc-400">
          <button
            className="cursor-pointer hover:text-zinc-100 disabled:text-zinc-600"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button
            className="cursor-pointer hover:text-zinc-100 disabled:text-zinc-600"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-x-4 bg-zinc-900 border-b border-zinc-800">
        {["Classroom", "Total Students", "Avg Score", "Improvement", "Completion Rate", "Active Tasks"].map(
          (header) => (
            <div
              key={header}
              className="py-3 px-4 text-left text-xs font-semibold text-zinc-400 uppercase"
            >
              {header}
            </div>
          )
        )}
      </div>

      {/* Data Rows */}
      {paginatedData.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-x-4 border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors"
        >
          <div className="py-[18px] px-4 font-medium text-zinc-200">{row.className}</div>
          <div className="py-[18px] px-4 text-zinc-300">{row.totalStudents}</div>
          <div className="py-[18px] px-4 text-zinc-300">{row.avgScore.toFixed(2)}%</div>
          <div
            className={`py-[18px] px-4 font-medium ${
              row.improvement > 0
                ? "text-green-400"
                : row.improvement < 0
                ? "text-red-400"
                : "text-zinc-400"
            }`}
          >
            {row.improvement > 0 ? "+" : ""}
            {row.improvement.toFixed(2)}%
          </div>
          <div className="py-[18px] px-4 text-zinc-300">{row.compRate.toFixed(2)}%</div>
          <div className="py-[18px] px-4 text-zinc-300">{row.activeTasks}</div>
        </div>
      ))}
    </div>
  );
};

/* ---------------- CATEGORY TREE ---------------- */
const CategoryTree: React.FC<{
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
}> = ({ selectedCategory, setSelectedCategory }) => {
  const items = ["Top Performing", "Least Performing", "Most Improved"];

  return (
    <div className="hover:border-slate-500 box-bg rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-zinc-100">Performance Categories</h3>
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          All Classes <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      <ul className="flex flex-col gap-1">
        {items.map((label) => (
          <li
            key={label}
            onClick={() => setSelectedCategory(label)}
            className={`flex items-center justify-between gap-3 p-2 rounded-md cursor-pointer ${
              selectedCategory === label
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <span className="flex-1 text-sm">{label}</span>
            {selectedCategory === label ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ---------------- PIE CHART ---------------- */
const GradeDistributionChart: React.FC<{ pieData: any[] }> = ({ pieData }) => {
  if (!pieData?.length) return null;

  const colors = ["#0059b3", "#027af2", "#4ca6ff", "#7dc8ff", "#a4d8ff"];
  const gradeData = pieData.map((g, idx) => ({
    ...g,
    color: colors[idx % colors.length],
  }));

  const totalClasses = gradeData.reduce((acc, g) => acc + g.value, 0);

  return (
    <div className="box-bg hover:border-slate-500 transition-all rounded-xl p-4 shadow-md relative flex flex-col justify-end">
      <h3 className="font-semibold text-zinc-100 mb-1 text-lg">
        Performance Grade Distribution
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Proportion of classrooms in each performance band
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
            {totalClasses}
          </span>
          <span className="text-sm text-zinc-400">Classrooms</span>
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
                  width: `${(g.value / totalClasses) * 100}%`,
                }}
              />
            </div>

            <span className="text-sm font-medium text-zinc-300">
              {((g.value / totalClasses) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
