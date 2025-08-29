
import Sidebar from "@/_components/(commomComponents)/sidebar";
import Header from "@/_components/(commomComponents)/header";  
import { IconGraph,IconBell,IconStudent } from "@/_components/(Icons)/Icons";
import { IconNotebook } from "@/_components/(Icons)/bookIcon";

const studentDashboardLinks = [
  { name: "Dashboard", href: "/dashboard/student", icon: <IconGraph /> },
  { name: "Classroom", href: "/dashboard/student/classroom", icon: <IconStudent /> },
  { name: "Quizzes", href: "/dashboard/student/Quizzes", icon: <IconNotebook /> },
  { name: "Notification", href: "/dashboard/student/notification", icon: <IconBell /> },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen  relative justify-center items-center bg-black min-w-screen">
      <Header />
      <Sidebar DashboardLinks={studentDashboardLinks} />
      <div className="ml-64 w-full pt-32 flex items-center  justify-center h-full">
        {children}
      </div>
    </div>
  );
}
