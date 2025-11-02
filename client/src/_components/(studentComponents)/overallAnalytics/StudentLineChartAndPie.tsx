"use client";

import React, { useState } from "react";
import { LineChart } from "@mui/x-charts";
import { MenuItem, Select } from "@mui/material";
import { PieChart } from "@mui/x-charts";



const StudentPerformanceChart: React.FC = () => {
  // 20 dummy tasks/weeks
  const taskLabels = Array.from({ length: 20 }, (_, i) => `Week-${i + 1}`);

  // Student’s total score trend (alternating pattern + rise at end)
  const totalScore = [
    60, 53, 68, 76, 42, 70, 67, 74, 71, 78,
    55, 52, 79, 46, 83, 70, 90, 93, 56, 98,
  ];

  // Class average trend
  const classAverage = [
    35, 48, 54, 40, 57, 73, 71, 56, 84, 79,
    87, 82, 80, 84, 62, 66, 87, 79, 91, 93,
  ];



  // Show 5-week chunks for dropdown
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

  // Slice for selected range
  const slicedLabels = taskLabels.slice(range.start, range.end);
  const slicedTotal = totalScore.slice(range.start, range.end);
  const slicedClass = classAverage.slice(range.start, range.end);


  return (
    <div className="p-4 rounded-2xl box-bg hover:border-slate-500 border border-gray-700/40 transition-all">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-white">Score Progress Over Time</h3>

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
        Visualize how your performance evolved compared to the class and overall average.
      </p>

      {/* Chart */}
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
              data: slicedTotal,
              label: "Your Average",
              color: "#4ca6ff", // blue
              
              showMark: true,
            },
            {
              data: slicedClass,
              label: "Overall Average",
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

      
    </div>
  );
};

const StudentGradeChart:React.FC = () => {
  const [gradeData, setGradeData] = React.useState<
    { name: string; value: number; color: string }[]
  >([]);

  React.useEffect(() => {
    // Example student performance breakdown
    setGradeData([
      { name: "Exceptional (90–100%)", value: 20, color: "#0059b3" },
      { name: "Proficient (75–89%)", value: 35, color: "#027af2" },
      { name: "Developing (60–74%)", value: 25, color: "#4ca6ff" },
      { name: "Emerging (45–59%)", value: 15, color: "#7dc8ff" },
      { name: "Needs Attention (<45%)", value: 5, color: "#a4d8ff" },
    ]);
  }, []);

  if (gradeData.length === 0) return null;

  // Calculate total tasks for center label
  const totalTasks = gradeData.reduce((acc, g) => acc + g.value, 0);

  return (
    <div className="box-bg hover:border-slate-500 transition-all rounded-xl p-4 shadow-md relative flex flex-col justify-end">
      <h3 className="font-semibold text-zinc-100 mb-1 text-lg">
        Performance Grade Distribution
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Proportion of tasks in each grade band
      </p>

      {/* Pie Chart */}
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

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-zinc-100">
            {totalTasks}
          </span>
          <span className="text-sm text-zinc-400">Total Tasks</span>
        </div>
      </div>

      {/* Legend + Progress Bars */}
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

const StudentPerformanceAndGradeComp=()=>{
    return(
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              <StudentPerformanceChart/>
              <StudentGradeChart />
        </div>
    )
}

export default StudentPerformanceAndGradeComp;
