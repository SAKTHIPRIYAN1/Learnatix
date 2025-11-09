
"use client";

import * as React from "react";
import ClassroomSpecificBarAndLine from "@/_components/(teacherComponents)/classRoomSpecificAnalytics/ClassRoomAnalyticsBarAndLine";
import ClassroomSpecificTableAndPie from "@/_components/(teacherComponents)/classRoomSpecificAnalytics/ClassAnalyticsTableAndPie";
import ClassroomOverviewCard from "@/_components/(teacherComponents)/classRoomSpecificAnalytics/countCard";

// ---------- Main Classroom Analytics Page ----------
const ClassroomSpecificAnalyticsPage: React.FC = () => {
  return (
    <div className="w-full pr-6">
      {/* ---------- Page Header ---------- */}
      <h2 className="text-xl font-semibold mb-4 text-zinc-100">
        Classroom Analytics Overview
      </h2>

      {/* ---------- Top Section for Overview Cards ---------- */}
      <div className="w-full">
        <ClassroomOverviewCard />
      </div>

      {/* ---------- Line + Bar Chart Section ---------- */}
      <div className="w-full mt-6">
        <ClassroomSpecificBarAndLine />
      </div>

      {/* ---------- Task Summary Table ---------- */}
      <div className="py-4 w-full">
        <ClassroomSpecificTableAndPie />
      </div>
    </div>
  );
};

export default ClassroomSpecificAnalyticsPage;
