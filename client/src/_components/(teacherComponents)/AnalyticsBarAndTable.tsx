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

const PerformanceTrendChart = ({
  taskLabels,
  avgPerformance,
  topClass,
  lowClass,
}: {
  taskLabels: string[];
  avgPerformance: number[];
  topClass: number[];
  lowClass: number[];
}) => {
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
    <div className="p-4 rounded-2xl box-bg">
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
            minWidth: "120px",
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

      <div className="w-full">
        <LineChart
        // className=""
          height={300}
          xAxis={[
            {
              data: slicedLabels.map((_, i) => `Week-${range.start + i + 1}`),
              scaleType: "band",
              tickLabelStyle: { fill: "#cbd5e1", fontSize: 12 },
            },
          ]}
          yAxis={[
            {
              min: 0,
              tickLabelStyle: { fill: "#cbd5e1", fontSize: 12 },
            },
          ]}
          series={[
            {
              data: slicedAvg,
              label: "Overall Average",
              color: "#027af2", // sky-400
              showMark: true,
            },
            {
              data: slicedTop,
              label: "Top Classroom",
              color: "#0059b3", // sky-600
              showMark: true,
            },
            {
              data: slicedLow,
              label: "Lowest Classroom",
              color: "#4ca6ff", // sky-900
              showMark: true,
            },
          ]}
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
          grid={{ horizontal: true, vertical: false }}
          slotProps={{
            legend: { direction:"horizontal", position: { vertical: "top", horizontal: "center" } },
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
const GradeDistributionChart = ({
  classLabels,
  gradeA,
  gradeB,
  gradeC,
}: {
  classLabels: string[];
  gradeA: number[];
  gradeB: number[];
  gradeC: number[];
}) => {
  return (
    <div className="p-4 rounded-2xl box-bg">
      <h3 className="text-lg font-bold text-white mb-2">
        Grade Distribution by Class
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Number of students in each grade category
      </p>

      <BarChart
        height={300}
        xAxis={[{ data: classLabels, scaleType: "band" }]}
        series={[
          {
            data: gradeA,
            label: "A (80–100%)",
            color: "#4ca6ff", 
            stack: "total",
          },
          {
            data: gradeB,
            label: "B (50–79%)",
            color: "#027af2",
            stack: "total",
          },
          {
            data: gradeC,
            label: "C (other)",
            color: "#0059b3", 
            stack: "total",
          },
        ]}
        margin={{ top: 20, right: 30, bottom: 40, left: 50 }}
        grid={{ horizontal: true }}
        slotProps={{
          tooltip: { trigger: "axis" },
        }}

        sx={{
          "& .MuiChartsLegend-root": { color: "#ccc" },
          "& .MuiChartsAxis-tickLabel": { fill: "#ccc" },
          "& .MuiChartsAxis-line": { stroke: "#444" },
          "& .MuiChartsGrid-line": { stroke: "#333", strokeDasharray: "4" },
        }}

      />
    </div>
  );
};

// ---------- Parent Wrapper ----------
const DashboardCharts: React.FC = () => {
  // Sample dummy data (replace with API or state later)
  const taskLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
  const avgPerformance = [68, 72, 77, 81, 85];
  const topClass = [85, 88, 90, 93, 95];
  const lowClass = [55, 60, 62, 67, 70];

  const classLabels = ["Class A", "Class B", "Class C", "Class D", "Class E"];
  const gradeA = [12, 10, 8, 11, 13];
  const gradeB = [14, 15, 16, 13, 12];
  const gradeC = [10, 12, 13, 11, 9];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      <PerformanceTrendChart
        taskLabels={taskLabels}
        avgPerformance={avgPerformance}
        topClass={topClass}
        lowClass={lowClass}
      />
      <GradeDistributionChart
        classLabels={classLabels}
        gradeA={gradeA}
        gradeB={gradeB}
        gradeC={gradeC}
      />
    </div>
  );
};

export default DashboardCharts;
