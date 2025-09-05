
import Sidebar from "@/_components/utilsComponents/sidebar";
import Header from "@/_components/utilsComponents/header";  
import {IconBell,IconStudent } from "@/_components/(Icons)/Icons";
import { IconNotebook } from "@/_components/(Icons)/bookIcon";
import { IconSettings } from "@/_components/(Icons)/Icons";
import HistoryNavigation from "@/_components/utilsComponents/historyNavigation";
import CreateClassRoomComp from "@/_components/(teacherComponents)/createClassRoom";

const TeacherDashboardLinks = [
 
  { name: "Classroom", href: "/dashboard/teacher/classroom", icon: <IconStudent /> },
  { name: "Quizzes", href: "/dashboard/teacher/quizzes", icon: <IconNotebook /> },
  { name: "Notifications", href: "/dashboard/teacher/notification", icon: <IconBell /> },
  {name:"Settings",href:"/dashboard/teacher/classroom",icon:<IconSettings />}
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex relative justify-center bg-[#010108] items-center h-[100vh]  min-w-screen">
      <Header />
      <Sidebar DashboardLinks={TeacherDashboardLinks} />
      <div className="  ml-60  w-full pt-19 relative  bg-[#010108]  gap-3 flex-row pl-6 h-full ">
        <CreateClassRoomComp />
        <HistoryNavigation />
        {children}
      </div>
      
    </div>
  );
}
