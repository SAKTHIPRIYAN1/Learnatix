"use client";

import * as React from "react";
import { LineChart, BarChart } from "@mui/x-charts";

// ---------- Line Chart Component ----------
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { useState } from "react";

interface PerformanceTrendChartProps {
  taskLabels: string[];
  avgPerformance: number[];
  topClass: number[];
  lowClass: number[];
}

const PerformanceTrendChart = () => {
  // 20 dummy week labels
  const taskLabels = Array.from({ length: 20 }, (_, i) => `Week-${i + 1}`);

  // Dummy data (you can randomize or tweak)
  const avgPerformance = [
    60, 62, 65, 68, 70, 66, 71, 74, 69, 72,
    75, 77, 79, 81, 84, 82, 85, 88, 90, 92,
  ];
  const topClass = [
    80, 82, 84, 86, 88, 87, 90, 92, 91, 93,
    95, 96, 97, 98, 99, 97, 98, 99, 100, 100,
  ];
  const lowClass = [
    40, 45, 50, 48, 52, 51, 55, 57, 60, 62,
    63, 65, 67, 69, 71, 70, 72, 73, 74, 76,
  ];

  // Show 5-week chunks
  const chunkSize = 5;
  const totalWeeks = Math.ceil(taskLabels.length / chunkSize);
  const weekRanges = Array.from({ length: totalWeeks }, (_, i) => ({
    label: `Weeks ${i * chunkSize + 1}-${Math.min(
      (i + 1) * chunkSize,
      taskLabels.length
    )}`,
    start: i * chunkSize,
    end: (i + 1) * chunkSize,
  }));

  const [selectedRange, setSelectedRange] = useState(0);
  const range = weekRanges[selectedRange];

  const slicedLabels = taskLabels.slice(range.start, range.end);
  const slicedAvg = avgPerformance.slice(range.start, range.end);
  const slicedTop = topClass.slice(range.start, range.end);
  const slicedLow = lowClass.slice(range.start, range.end);

  return (
    <div className="p-4 rounded-2xl box-bg hover:border-slate-500 transition-all">
      {/* Header with Dropdown */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-white">
          Overall Performance Trend
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
          {weekRanges.map((range, index) => (
            <MenuItem key={index} value={index}>
              {range.label}
            </MenuItem>
          ))}
        </Select>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        Average performance of students across selected weekly range
      </p>

      {/* Line Chart */}
      <div className="w-full">
        <LineChart
          height={300}
          xAxis={[
            {
              data: slicedLabels,
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
              data: slicedAvg,
              label: "Overall Average",
              color: "#027af2",
              showMark: true,
            },
            {
              data: slicedTop,
              label: "Top Classroom",
              color: "#4ca6ff",
              showMark: true,
            },
            {
              data: slicedLow,
              label: "Lowest Classroom",
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
          }}
        />
      </div>
    </div>
  );
};

// ---------- Bar Chart Component ----------
export const GradeDistributionChart = () => {
  // Generate dummy data
  const totalClasses = 20;
  const classLabels = Array.from({ length: totalClasses }, (_, i) => `Class ${i + 1}`);
  const gradeA = Array.from({ length: totalClasses }, () => Math.floor(Math.random() * 30) + 10);
  const gradeB = Array.from({ length: totalClasses }, () => Math.floor(Math.random() * 25) + 5);
  const gradeC = Array.from({ length: totalClasses }, () => Math.floor(Math.random() * 20) + 2);

  // Pagination
  const classesPerPage = 5;
  const [page, setPage] = React.useState(0);
  const totalPages = Math.ceil(totalClasses / classesPerPage);

  const startIndex = page * classesPerPage;
  const visibleClasses = classLabels.slice(startIndex, startIndex + classesPerPage);
  const visibleA = gradeA.slice(startIndex, startIndex + classesPerPage);
  const visibleB = gradeB.slice(startIndex, startIndex + classesPerPage);
  const visibleC = gradeC.slice(startIndex, startIndex + classesPerPage);

  return (
    <div className="p-4 rounded-2xl box-bg hover:border-slate-500">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-white">Grade Distribution by Class</h3>
          <p className="text-gray-400 text-sm">Number of students in each grade category</p>
        </div>

        <div className="flex items-center cursor-pointer gap-2">
          <select
            aria-label="Select classes  page"
            value={page}
            onChange={(e) => setPage(parseInt(e.target.value, 10))}
            className=" p-2 pl-4 cursor-pointer text-white bg-[#18181b] rounded-lg text-[0.9rem] "
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <option key={i} value={i} className="cursor-pointer">
                Classes {i * classesPerPage + 1}–{Math.min((i + 1) * classesPerPage, totalClasses)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bar Chart */}
      <BarChart
        height={360}
        // xAxis must use visibleClasses so labels render on the x-axis inside the chart
        xAxis={[
          {
            data: visibleClasses,
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
          { data: visibleA, label: "A (80–100%)", color: "#4ca6ff", stack: "total" },
          { data: visibleB, label: "B (50–79%)", color: "#027af2", stack: "total" },
          { data: visibleC, label: "C (other)", color: "#0059b3", stack: "total" },
        ]}
        margin={{ top: 20, right: 30, bottom: 80, left: 60 }} // bottom bigger to avoid clipped labels
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      <PerformanceTrendChart />
      <GradeDistributionChart      />
    </div>
  );
};

export default DashboardCharts;
