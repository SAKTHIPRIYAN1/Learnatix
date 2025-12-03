"use client";

import * as React from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const StudentTaskPerformanceTable: React.FC = () => {
  const { user } = useUser();
  const [allData, setAllData] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [page, setPage] = React.useState(0);
  const rowsPerPage = 10;

  const [sortKey, setSortKey] = React.useState<"score" | "status" | null>(null);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const fetchData = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/analytics/student/table/${user.id}?page=${page}&limit=${rowsPerPage}`
      );
      const { data, total } = res.data as { data: any[]; total: number };
      setAllData(data);
      setTotal(total);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [user, page]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (key: "score" | "status") => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return allData;
    return [...allData].sort((a, b) => {
      if (sortKey === "score")
        return sortOrder === "asc" ? a.score - b.score : b.score - a.score;
      if (sortKey === "status")
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      return 0;
    });
  }, [allData, sortKey, sortOrder]);

  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <div className="hover:border-slate-500 transition-all box-bg rounded-lg shadow-md overflow-hidden flex flex-col">
      {/* Header + Pagination (Top-Left) */}
      <div className="flex justify-between items-center p-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-zinc-100">
            Task Performance Summary
          </h2>
          {/* Pagination Controls */}
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>
              {page * rowsPerPage + 1}–
              {Math.min((page + 1) * rowsPerPage, total)} of {total}
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
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="text-center py-10 text-zinc-400">Loading...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-400">{error}</div>
      ) : allData.length === 0 ? (
        <div className="text-center py-10 text-zinc-400">No data available</div>
      ) : (
        <>
          {/* Table Header */}
          <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_2fr] bg-zinc-900 border-b border-zinc-800">
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
                {sortKey === "score" && header === "Score" && (
                  <span className="ml-1 text-[10px] text-zinc-500">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
                {sortKey === "status" && header === "Submission Status" && (
                  <span className="ml-1 text-[10px] text-zinc-500">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {sortedData.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_2fr] border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors"
            >
              <div className="py-3 px-4">
                <input
                  type="checkbox"
                  className="cursor-pointer accent-blue-500 bg-zinc-800 border-zinc-700 rounded"
                />
              </div>
              <div className="py-3 px-4 font-medium text-zinc-200 truncate">
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
              <div className="py-3 px-4 text-zinc-400">
                {new Date(row.evaluatedOn).toLocaleDateString()}
              </div>
              <div className="py-3 px-4 text-zinc-400 truncate">
                {row.remarks}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
