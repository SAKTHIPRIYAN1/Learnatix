"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
} from "lucide-react";
import { PieChart } from "@mui/x-charts";

const ClassroomSpecificTableAndPie: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    React.useState("Top Scorers");

  return (
    <div className="min-h-screen px-0 p-6 text-zinc-100">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-stretch">
        {/* LEFT SECTION */}
        <StudentTable selectedCategory={selectedCategory} />

        {/* RIGHT SECTION */}
        <div className="flex flex-col justify-between gap-6 h-full">
          <CategoryTree
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <GradeDistributionChart />
        </div>
      </div>
    </div>
  );
};

export default ClassroomSpecificTableAndPie;

/* ---------------- STUDENT TABLE ---------------- */
const StudentTable: React.FC<{ selectedCategory: string }> = ({
  selectedCategory,
}) => {
  const [students, setStudents] = React.useState<
    {
      id: number;
      name: string;
      roll: string;
      avgScore: number;
      prevScore: number;
      improvement: number;
      tasksCompleted: number;
      attendance: number;
      lastActive: string;
    }[]
  >([]);

  React.useEffect(() => {
    const data = Array.from({ length: 60 }).map((_, i) => {
      const prevScore = Math.floor(Math.random() * 50) + 40;
      const currentScore = Math.floor(Math.random() * 51) + 50;
      return {
        id: i + 1,
        name: `Student ${i + 1}`,
        roll: `22CSE${100 + i}`,
        avgScore: currentScore,
        prevScore,
        improvement: currentScore - prevScore,
        tasksCompleted: Math.floor(Math.random() * 10),
        attendance: Math.floor(Math.random() * 20) + 80,
        lastActive: `${Math.floor(Math.random() * 7) + 1} days ago`,
      };
    });
    setStudents(data);
  }, []);

  const getFilteredData = React.useCallback(() => {
    switch (selectedCategory) {
      case "Top Scorers":
        return [...students].sort((a, b) => b.avgScore - a.avgScore);
      case "Most Improved":
        return [...students].sort((a, b) => b.improvement - a.improvement);
      case "Low Performers":
        return [...students].sort((a, b) => a.avgScore - b.avgScore);
      default:
        return students;
    }
  }, [selectedCategory, students]);

  const filteredData = getFilteredData();

  const [page, setPage] = React.useState(0);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="hover:border-slate-500 transition-all box-bg rounded-lg shadow-md overflow-hidden flex flex-col">
      <h2 className="text-lg font-semibold text-zinc-100 p-4 border-b border-zinc-800">
        {selectedCategory} Students
      </h2>

      {/* Table Header */}
      <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_1fr] items-center gap-x-4 bg-zinc-900 border-b border-zinc-800">
        {[
          "",
          "Student Name",
          "Roll No",
          "Avg Score",
          "Improvement",
          "Tasks Done",
          "Attendance",
        ].map((header) => (
          <div
            key={header}
            className="py-3 px-4 text-left text-xs font-semibold text-zinc-400 uppercase"
          >
            {header}
          </div>
        ))}
      </div>

      {/* Data Rows */}
      <div>
        {paginatedData.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_1fr] items-center gap-x-4 border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors"
          >
            <div className="py-3 px-4">
              <input
                type="checkbox"
                className="cursor-pointer accent-blue-500 bg-zinc-800 border-zinc-700 rounded"
              />
            </div>
            <div className="py-3 px-4 font-medium text-zinc-200">
              {row.name}
            </div>
            <div className="py-3 px-4 text-zinc-300">{row.roll}</div>
            <div className="py-3 px-4 text-zinc-300">{row.avgScore}%</div>
            <div
              className={`py-3 px-4 font-medium ${
                row.improvement > 0
                  ? "text-green-400"
                  : row.improvement < 0
                  ? "text-red-400"
                  : "text-zinc-400"
              }`}
            >
              {row.improvement > 0 ? "+" : ""}
              {row.improvement}%
            </div>
            <div className="py-3 px-4 text-zinc-300">
              {row.tasksCompleted}
            </div>
            <div className="py-3 px-4 text-zinc-300">{row.attendance}%</div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-6 p-4 text-sm text-zinc-400 border-t border-zinc-800 mt-auto">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select className="cursor-pointer bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300">
            <option>{rowsPerPage}</option>
          </select>
        </div>
        <span>
          {page * rowsPerPage + 1}–
          {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{" "}
          {filteredData.length}
        </span>
        <div className="flex gap-2">
          <button
            className="cursor-pointer hover:text-zinc-100 disabled:text-zinc-600"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="cursor-pointer hover:text-zinc-100 disabled:text-zinc-600"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- CATEGORY TREE ---------------- */
export const CategoryTree: React.FC<{
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
}> = ({ selectedCategory, setSelectedCategory }) => {
  const items = ["Top Scorers", "Most Improved", "Low Performers"];

  return (
    <div className="hover:border-slate-500 box-bg rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-zinc-100">Performance Filters</h3>
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          Class 12C <ChevronDown className="w-4 h-4" />
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
export const GradeDistributionChart: React.FC = () => {
  const [gradeData, setGradeData] = React.useState<
    { name: string; value: number; color: string }[]
  >([]);

  React.useEffect(() => {
    setGradeData([
      { name: "A (90–100%)", value: 30, color: "#0ea5e9" },
      { name: "B (75–89%)", value: 40, color: "#0284c7" },
      { name: "C (60–74%)", value: 20, color: "#0369a1" },
      { name: "D (45–59%)", value: 7, color: "#075985" },
      { name: "E (<45%)", value: 3, color: "#1e3a8a" },
    ]);
  }, []);

  const totalStudents = 60;

  return (
    <div className="box-bg hover:border-slate-500 transition-all rounded-lg p-4 shadow-md relative flex flex-col justify-end">
      <h3 className="font-semibold text-zinc-100 mb-4">
        Grade Distribution of This Class
      </h3>

      <div className="flex justify-center relative">
        <PieChart
          height={220}
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
                color: "#566481",
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
            {totalStudents}
          </span>
          <span className="text-sm text-zinc-400">Students</span>
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
                  width: `${g.value}%`,
                }}
              />
            </div>
            <span className="text-sm font-medium text-zinc-300">
              {g.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
