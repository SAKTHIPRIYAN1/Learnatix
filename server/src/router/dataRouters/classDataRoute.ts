import express from "express";
import {classData,taskData} from "../../fakerData/classData";
import { getGradeDistributionByClass,getMonthlyAverages,getPerformanceCategories } from "../../fakerData/classData";

import prisma from "../../prisma";
import { Request } from "express";

const ClassDataRouter = express.Router();

ClassDataRouter.get("/countCard/:userId", async(req:Request<{userId:string},{},{}>, res) => {
  try{
    const {userId} = req.params;
        // Check if user is a teacher in the class
        const user = await prisma.users.findUnique({
          where:{
            clerkId:userId,
            role:"TEACHER"
          }
        })

        if(!user){
            res.status(401).json({msg:"Not Authorized"});
            return;
        }
  }
  catch(err){
    res.status(500).json({msg:"Internal Server Error"});
    return;
  }

  const totalActiveClassRoom=classData.length;
  let totalStudent:number=0;
  let avgScore=0;
  for(let i=0;i<classData.length;i++){
    totalStudent+=classData[i].totalStudents;
    avgScore+=classData[i].avgScore;
  }

  avgScore=avgScore/classData.length;
  avgScore=Number(avgScore.toFixed(2));

  res.status(200).json({msg:"Ok!!",classCountData:{totalActiveClassRoom,totalStudent,avgScore}});
});

// performance line and grade bar chart!!

ClassDataRouter.get("/gradePerformance/:userId", async(req:Request<{userId:string},{},{}>, res) => {
  try{
    const {userId} = req.params;
        // Check if user is a teacher in the class
        const user = await prisma.users.findUnique({
          where:{
            clerkId:userId,
            role:"TEACHER"
          }
        })

        if(!user){
            res.status(401).json({msg:"Not Authorized"});
            return;
        }
  }
  catch(err){
    res.status(500).json({msg:"Internal Server Error"});
    return;
  }

  const classGradeDis=getGradeDistributionByClass(classData);
  const classMonthlySocre=getMonthlyAverages(classData);

  const monthlyScore=(
    classMonthlySocre.overallMonthly.map((el,idx)=>{
      return (
        {
          month:el.month,
          avgScore:el.avgScore,
          topClass:classMonthlySocre.topClassMonthly[idx].avgScore,
          lowClass:classMonthlySocre.leastClassMonthly[idx].avgScore
        }
      )
    })
  )

  res.status(200).json({msg:"Ok!",classData:{classGradeDis,classMonthlySocre:monthlyScore}});
});


ClassDataRouter.get("/tablePie/:userId", async(req:Request<{userId:string},{},{}>, res) => {
  try{
    const {userId} = req.params;
        // Check if user is a teacher in the class
        const user = await prisma.users.findUnique({
          where:{
            clerkId:userId,
            role:"TEACHER"
          }
        })

        if(!user){
            res.status(401).json({msg:"Not Authorized"});
            return;
        }
  }
  catch(err){
    res.status(500).json({msg:"Internal Server Error"});
    return;
  }

  const performanceData=getPerformanceCategories(classData);
  const classTableData=classData.map((el)=>{
    return(
      {
        className:el.className,
        totalStudents:el.totalStudents,
        avgScore:el.avgScore,
        improvement:el.improvement,
        compRate:el.avgCompletionRate,
        activeTasks:el.activeTasks
      }
    )
  });

  res.status(200).json({msg:"Ok!",classData:{performanceData,tableData:classTableData}});
})

export default ClassDataRouter;
