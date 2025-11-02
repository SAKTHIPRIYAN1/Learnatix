
import * as React from "react";
import StudentCountCard from "@/_components/(studentComponents)/overallAnalytics/StudentCountComp";
import StudentPerformanceAndGradeComp from "@/_components/(studentComponents)/overallAnalytics/StudentLineChartAndPie";
import { StudentTaskPerformanceTable } from "@/_components/(studentComponents)/overallAnalytics/StudentTable";


// ---------- Main Analytics Page ----------
const StudentAnalyticsPage: React.FC = () => {
  return (
    <div className="w-full pr-6">
      <h2 className="text-xl font-semibold mb-4">Overview</h2>

      {/* ---------- Top Section for stud Info cards ---------- */}
      <div className="w-full">
        <StudentCountCard />
      </div>
      
      {/* Performance Line and the Syud Grade Pie Chart and grphs!! */}
      <div className="w-full">
        <StudentPerformanceAndGradeComp />
      </div>

      {/* Task Overivw Table!! */}
      <div className=" py-4 w-full">
        <StudentTaskPerformanceTable />
      </div>

      
    </div>
  );
};

export default StudentAnalyticsPage;