import React from "react";
import SideBarFooter from "./sidebarFooter";
import Link from "next/link";

interface SideBarLinks {
  name: string;
  href: string;
  icon: React.ReactNode;
}



const Sidebar = ({DashboardLinks}:{DashboardLinks:SideBarLinks[]}) => {
  
  return (
    <div className="flex flex-col justify-between overflow-scroll pb-4 bg-gray-950 h-full fixed left-0 pt-20  top-0  w-60 border-r-[0.5px] border-r-slate-800 text-white ">


    {/* Top Section (links) */}
    <div className="flex flex-col ">
      {DashboardLinks.map((link) => (
        <SideBarComp key={link.name} {...link} />
      ))}
    </div>

    {/* Footer Section */}
    <div className="pt-2 flex">
      <SideBarFooter />
    </div>

  </div>


  );
};

export const SideBarComp=(prop:SideBarLinks)=>{
  return (
    <div className=" ml-2 py-[5px] mb-1  px-3 w-[90%]  rounded text-gray-400 hover:text-white hover:bg-slate-800 cursor-pointer flex items-center gap-2">
      {prop.icon}
      <Link href={prop.href} className="text-sm/6">
        {prop.name}
      </Link>
    </div>
  )
}
export default Sidebar;