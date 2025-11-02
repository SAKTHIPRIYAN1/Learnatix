"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const StudentTaskPerformanceTable: React.FC = () => {
  const [allData, setAllData] = React.useState<
    {
      id: number;
      task: string;
      score: number;
      classAvg: number;
      status: string;
      evaluatedOn: string;
      remarks: string;
    }[]
  >([]);

  const [sortKey, setSortKey] = React.useState<"score" | "status" | null>(null);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  React.useEffect(() => {
    const data = Array.from({ length: 40 }).map((_, i) => {
      const classAvg = Math.floor(Math.random() * 40) + 50;
      const score = Math.floor(Math.random() * 40) + 50;
      const statusOptions = ["Submitted", "Pending", "Late"];
      const status =
        statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const remarks =
        score > classAvg
          ? "Above Average"
          : score < classAvg
          ? "Needs Improvement"
          : "At Class Average";

      return {
        id: i + 1,
        task: `Task ${i + 1}`,
        score,
        classAvg,
        status,
        evaluatedOn: `${Math.floor(Math.random() * 10) + 1} days ago`,
        remarks,
      };
    });
    setAllData(data);
  }, []);

  // Sort logic
  const sortedData = React.useMemo(() => {
    if (!sortKey) return allData;
    const sorted = [...allData].sort((a, b) => {
      if (sortKey === "score") {
        return sortOrder === "asc" ? a.score - b.score : b.score - a.score;
      } else if (sortKey === "status") {
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });
    return sorted;
  }, [allData, sortKey, sortOrder]);

  // Pagination
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (key: "score" | "status") => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  return (
    <div className="hover:border-slate-500 transition-all box-bg rounded-lg shadow-md overflow-hidden flex flex-col">
      <h2 className="text-lg font-semibold text-zinc-100 p-4 border-b border-zinc-800">
        Task Performance Summary
      </h2>

      {/* Table Header */}
      <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_2fr] items-center gap-x-4 bg-zinc-900 border-b border-zinc-800">
        {[
          "",
          "Task",
          "Score",
          "Class Avg",
          "Submission Status",
          "Evaluated On",
          "Remarks",
        ].map((header) => (
          <div
            key={header}
            className="py-3 px-4 text-left text-xs font-semibold text-zinc-400 uppercase cursor-pointer select-none"
            onClick={() =>
              header === "Score"
                ? handleSort("score")
                : header === "Submission Status"
                ? handleSort("status")
                : null
            }
          >
            {header}
            {sortKey &&
              sortKey === "score" &&
              header === "Score" && (
                <span className="ml-1 text-[10px] text-zinc-500">
                  {sortOrder === "asc" ? "▲" : "▼"}
                </span>
              )}
            {sortKey &&
              sortKey === "status" &&
              header === "Submission Status" && (
                <span className="ml-1 text-[10px] text-zinc-500">
                  {sortOrder === "asc" ? "▲" : "▼"}
                </span>
              )}
          </div>
        ))}
      </div>

      {/* Data Rows */}
      <div>
        {paginatedData.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_2fr] items-center gap-x-4 border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors"
          >
            <div className="py-3 px-4">
              <input
                type="checkbox"
                className="cursor-pointer accent-blue-500 bg-zinc-800 border-zinc-700 rounded"
              />
            </div>
            <div className="py-3 px-4 font-medium text-zinc-200">
              {row.task}
            </div>
            <div className="py-3 px-4 text-zinc-300">{row.score}%</div>
            <div className="py-3 px-4 text-zinc-300">{row.classAvg}%</div>
            <div
              className={`py-3 px-4 font-medium ${
                row.status === "Submitted"
                  ? "text-green-400"
                  : row.status === "Late"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {row.status}
            </div>
            <div className="py-3 px-4 text-zinc-400">{row.evaluatedOn}</div>
            <div className="py-3 px-4 text-zinc-400">{row.remarks}</div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-6 p-4 text-sm text-zinc-400 border-t border-zinc-800 mt-auto">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select className=" cursor-pointer bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300">
            <option>{rowsPerPage}</option>
          </select>
        </div>
        <span>
          {page * rowsPerPage + 1}–
          {Math.min((page + 1) * rowsPerPage, sortedData.length)} of{" "}
          {sortedData.length}
        </span>
        <div className="flex gap-2">
          <button
            className=  " cursor-pointer hover:text-zinc-100 disabled:text-zinc-600"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
          >
            <ChevronLeft className=" cursor-pointer w-4 h-4" />
          </button>
          <button
            className=" cursor-pointer hover:text-zinc-100 disabled:text-zinc-600"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          >
            <ChevronRight className=" cursor-pointer w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
