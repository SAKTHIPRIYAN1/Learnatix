"use client";
import React from 'react';
import RightArrow from '../(Icons)/navRight';

import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {useRouter} from 'next/navigation';

const HistoryNavigation = () => {
    const router=useRouter();
    const pathname = usePathname();
    const splittedPath = pathname.split('/').filter(Boolean);

// always the second one is the role!!!
    const role=splittedPath[1];

    // do the stuff of making breadcrumb items 
    // and also make the link DashBoard -> Teacher Dashboard or Student Dashboard based on the role

    const customLabel:Record<string,string> ={
        dashboard:"Dashboard",
    }

    const customRedirects: Record<string, string> = {
    dashboard: "/dashboard/" + role
  };

    const skippableNav:string[]=['student','teacher'];
    // console.log("sp;",splittedPath);
    const breadcrumbItems = splittedPath.reduce((acc, seg, idx) => {
        if (skippableNav.includes(seg)) return acc;
       const segi=seg[0].toUpperCase()+seg.slice(1,);
        const href = "/" + splittedPath.slice(0, idx + 1).join("/");
        acc.push({
            name: customLabel[seg]??segi,
            href: customRedirects[seg] ?? href,
        });
        return acc;
        }, [] as { name: string; href: string }[]);


    console.log("Breadcrumb Items:", breadcrumbItems);

    // Render the breadcrumb navigation
    // For simplicity, we'll just display the current path  as text
  return(
    <div className='flex font-medium'>
        <nav className="flex items-center gap-2 text-sm">
            {breadcrumbItems.map((nav, idx) => (
                <span key={idx} className="flex items-center gap-2">
                <button
                    onClick={() => router.push(nav.href)}
                    className={
                        "hover:underline cursor-pointer " +
                        (idx === breadcrumbItems.length - 1 ? "text-blue-600"
                        : "text-zinc-300")
                    }
                >
                    {nav.name}
                </button>
                {idx < breadcrumbItems.length - 1 && <RightArrow />}
                </span>
            ))}
            </nav>
    </div>
  )
};

export default HistoryNavigation;