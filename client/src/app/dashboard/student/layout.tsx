
import Sidebar from "@/_components/utilsComponents/sidebar";
import Header from "@/_components/utilsComponents/header";  
import { IconGraph,IconBell,IconStudent } from "@/_components/(Icons)/Icons";
import { IconNotebook } from "@/_components/(Icons)/bookIcon";
import HistoryNavigation from "@/_components/utilsComponents/historyNavigation";
import JoinClassRoomComp from "@/_components/(studentComponents)/joinClass";


const studentDashboardLinks = [
  { name: "Classroom", href: "/dashboard/student/classroom", icon: <IconStudent /> },
  { name: "Analytics", href: "/dashboard/student/analytics", icon: <IconGraph /> },
  { name: "Quizzes", href: "/dashboard/student/quizzes", icon: <IconNotebook /> },
  { name: "Notifications", href: "/dashboard/student/notification", icon: <IconBell /> },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-[100vh] relative justify-center items-center bg-[#010108]  overflow-y-auto min-w-screen">
      <Header />
      <Sidebar DashboardLinks={studentDashboardLinks} />
      <div className="  ml-60  w-full pt-19 relative bg-[#010108]  gap-3 flex-row pl-6 h-full ">
        <HistoryNavigation />
        <JoinClassRoomComp />
        {children}
      </div>
      
    </div>
  );
}
