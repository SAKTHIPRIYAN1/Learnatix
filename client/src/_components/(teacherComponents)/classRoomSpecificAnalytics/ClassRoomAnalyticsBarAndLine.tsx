"use client";

import * as React from "react";
import { LineChart, BarChart } from "@mui/x-charts";
import { MenuItem, Select } from "@mui/material";


const StudentPerformanceTrend = () => {

  const weekLabels = Array.from({ length: 20 }, (_, i) => `Week-${i + 1}`);

  // Alternating up/down pattern and overall growth trend
  const studentPerformance = [
    60, 65, 62, 68, 64, 72, 70, 75, 73, 78,
    76, 82, 80, 85, 83, 88, 86, 90, 92, 95,
  ];

  // Split into 5-week chunks
  const chunkSize = 5;
  const totalChunks = Math.ceil(weekLabels.length / chunkSize);
  const weekRanges = Array.from({ length: totalChunks }, (_, i) => ({
    label: `Weeks ${i * chunkSize + 1}-${Math.min(
      (i + 1) * chunkSize,
      weekLabels.length
    )}`,
    start: i * chunkSize,
    end: (i + 1) * chunkSize,
  }));

  const [selectedRange, setSelectedRange] = React.useState(0);
  const current = weekRanges[selectedRange];

  const visibleWeeks = weekLabels.slice(current.start, current.end);
  const visiblePerformance = studentPerformance.slice(current.start, current.end);

  return (
    <div className="p-4 rounded-2xl box-bg hover:border-slate-500 transition-all">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-white">
          Student Performance Over Weeks
        </h3>

        <Select
          size="small"
          value={selectedRange}
          onChange={(e) => setSelectedRange(Number(e.target.value))}
          sx={{
            color: "white",
            backgroundColor: "#18181b",
            borderRadius: "8px",
            "& .MuiSelect-icon": { color: "white" },
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            fontSize: "0.9rem",
            minWidth: "130px",
          }}
        >
          {weekRanges.map((range, i) => (
            <MenuItem key={i} value={i}>
              {range.label}
            </MenuItem>
          ))}
        </Select>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        Average student performance progression during selected week range
      </p>

      {/* Line Chart */}
      <LineChart
        height={320}
        xAxis={[
          {
            data: visibleWeeks,
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
            data: visiblePerformance,
            label: "Average Score (%)",
            color: "#38bdf8", // sky-400
            showMark: true,
          },
        ]}
        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        grid={{ horizontal: true, vertical: false }}
        slotProps={{
          legend: {
            direction: "horizontal",
            position: { vertical: "bottom", horizontal: "center" },
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
  );
};

const TaskGradeDistribution = () => {
  const totalTasks = 20;
  const taskLabels = Array.from({ length: totalTasks }, (_, i) => `Task-${i + 1}`);

  const gradeA = Array.from({ length: totalTasks }, () => Math.floor(Math.random() * 30) + 10);
  const gradeB = Array.from({ length: totalTasks }, () => Math.floor(Math.random() * 25) + 5);
  const gradeC = Array.from({ length: totalTasks }, () => Math.floor(Math.random() * 20) + 2);

  const tasksPerPage = 5;
  const [page, setPage] = React.useState(0);
  const totalPages = Math.ceil(totalTasks / tasksPerPage);

  const start = page * tasksPerPage;
  const visibleTasks = taskLabels.slice(start, start + tasksPerPage);
  const visibleA = gradeA.slice(start, start + tasksPerPage);
  const visibleB = gradeB.slice(start, start + tasksPerPage);
  const visibleC = gradeC.slice(start, start + tasksPerPage);

  return (
    <div className="p-4 rounded-2xl box-bg hover:border-slate-500 transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-white">Grade Distribution by Task</h3>
          <p className="text-gray-400 text-sm">Student count in each grade category per task</p>
        </div>

        <select
          value={page}
          onChange={(e) => setPage(parseInt(e.target.value, 10))}
          className="p-2 pl-4 text-white bg-[#18181b] rounded-lg text-[0.9rem] cursor-pointer"
        >
          {Array.from({ length: totalPages }).map((_, i) => (
            <option key={i} value={i}>
              Tasks {i * tasksPerPage + 1}–{Math.min((i + 1) * tasksPerPage, totalTasks)}
            </option>
          ))}
        </select>
      </div>

      {/* Bar Chart */}
      <BarChart
        height={360}
        xAxis={[
          {
            data: visibleTasks,
            scaleType: "band",
            tickLabelStyle: { fill: "#cbd5e1", fontSize: 12 },
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
          { data: visibleA, label: "A (80–100%)", color: "#38bdf8", stack: "total" }, // sky-400
          { data: visibleB, label: "B (50–79%)", color: "#0284c7", stack: "total" }, // blue-600
          { data: visibleC, label: "C (Below 50%)", color: "#0c4a6e", stack: "total" }, // blue-900
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



const ClassroomSpecificBarAndLine: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      <StudentPerformanceTrend />
      <TaskGradeDistribution />
    </div>
  );
};

export default ClassroomSpecificBarAndLine;
