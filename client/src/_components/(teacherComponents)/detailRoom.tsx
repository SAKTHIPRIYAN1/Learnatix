"use client";

import React from "react";
import { BarChart } from "@mui/x-charts";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DetailsTable: React.FC = () => {
  const detailsData = [
    {
      id: 1,
      page: "Home",
      status: "Online",
      users: "4.8k",
      events: "12.5k",
      bounce: "8%",
      time: "3m 24s",
      conversions: [5, 8, 3, 10, 7, 12, 9, 4],
    },
    {
      id: 2,
      page: "About",
      status: "Offline",
      users: "3.2k",
      events: "10.2k",
      bounce: "12%",
      time: "2m 46s",
      conversions: [3, 6, 2, 8, 4, 10, 7, 2],
    },
    {
      id: 3,
      page: "Contact",
      status: "Online",
      users: "2.9k",
      events: "8.7k",
      bounce: "10%",
      time: "3m 05s",
      conversions: [2, 4, 6, 5, 8, 10, 6, 3],
    },
  ];

  return (
    <div className="bg-zinc-900 rounded-lg shadow-md overflow-hidden">
      <h2 className="text-lg font-semibold text-zinc-100 p-4 border-b border-zinc-800">
        Details
      </h2>

      <div className="grid grid-cols-[auto_3fr_1fr_1fr_1fr_1fr_1.5fr] items-center gap-x-4">
        {[
          "",
          "Page",
          "Status",
          "Users",
          "Events",
          "Bounce",
          "Daily Conversions",
        ].map((header) => (
          <div
            key={header}
            className="p-4 text-left text-xs font-semibold text-zinc-400 uppercase border-b border-zinc-800"
          >
            {header}
          </div>
        ))}

        {detailsData.map((row) => (
          <React.Fragment key={row.id}>
            <div className="p-4 border-b border-zinc-800">
              <input
                type="checkbox"
                className="accent-blue-500 bg-zinc-800 border-zinc-700 rounded"
              />
            </div>
            <div className="p-4 border-b border-zinc-800 font-medium">
              {row.page}
            </div>
            <div className="p-4 border-b border-zinc-800">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  row.status === "Online"
                    ? "bg-green-800 text-green-300"
                    : "bg-zinc-700 text-zinc-400"
                }`}
              >
                {row.status}
              </span>
            </div>
            <div className="p-4 border-b border-zinc-800">{row.users}</div>
            <div className="p-4 border-b border-zinc-800">{row.events}</div>
            <div className="p-4 border-b border-zinc-800">{row.bounce}</div>
            <div className="p-4 border-b border-zinc-800">
              <BarChart
                height={40}
                series={[{ data: row.conversions, color: "#3b82f6" }]}
                xAxis={[{ data: [], scaleType: "band" }]}
                grid={{ horizontal: false, vertical: false }}
                margin={{ top: 2, bottom: 2, left: 2, right: 2 }}
              />
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-6 p-4 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300">
            <option>20</option>
            <option>30</option>
          </select>
        </div>
        <span>1–20 of 35</span>
        <div className="flex gap-2">
          <button className="hover:text-zinc-100">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="hover:text-zinc-100">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsTable;
