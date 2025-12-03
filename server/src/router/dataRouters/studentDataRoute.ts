import express from "express";
import studentData from "../../fakerData/studentData";
const StudentDataRouter = express.Router();

import prisma from "../../prisma";

import { Request } from "express";

StudentDataRouter.get("/countCards/:userId", async (req:Request<{userId:string},{},{}>, res) => {
  console.log("class Data requested");
  const selectedStudentData=studentData[0];
  const {totalActiveClasses,totalTasksCompleted,avgScore} =selectedStudentData;

  try{

    const {userId} = req.params;
        // Check if user is a teacher in the class
        const user = await prisma.users.findUnique({
          where:{
            clerkId:userId
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
  res.status(200).json({msg:"count Card received",Studentdata:{totalActiveClasses,totalTasksCompleted,avgScore}});
});

StudentDataRouter.get(("/gradePerformance/:userId"),async (req:Request<{userId:string},{},{}>,res)=>{
  try{
    const {userId} = req.params;
        // Check if user is a teacher in the class
        const user = await prisma.users.findUnique({
          where:{
            clerkId:userId
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


  const selectedStudentData=studentData[0];
  const {monthlyScores,gradeDistribution} =selectedStudentData;
  res.status(200).json({msg:"OK",studentPerformanceData:{monthlyScores,gradeDistribution}})
});

StudentDataRouter.get("/table/:userId", async (req: Request<{ userId: string }, {}, {}>, res) => {
  try {
    const { userId } = req.params;
    const { page = "0", limit = "10" } = req.query;

    const user = await prisma.users.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      res.status(401).json({ msg: "Not Authorized" });
      return;
    }

    // --- Deterministic student selection ---
    const index = 0;
    
    const selectedStudent = studentData[index];

    const startIndex = Number(page) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedTasks = selectedStudent.taskDetails.slice(startIndex, endIndex);

    res.status(200).json({
      msg: "OK",
      total: selectedStudent.taskDetails.length,
      page: Number(page),
      limit: Number(limit),
      data: paginatedTasks.map((task) => ({
        id: task.taskId,
        task: task.taskName,
        score: task.score,
        classAvg: task.classAvg,
        status: task.submissionStatus,
        evaluatedOn: task.evaluatedOn,
        remarks: task.remarks,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});



export default StudentDataRouter;
