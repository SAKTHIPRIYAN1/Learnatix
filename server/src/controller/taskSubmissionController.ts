
import { Request,RequestHandler,Response } from "express";
import prisma from "../prisma";

// model TaskSubmission{
//   submissionId String @id @default(uuid())
//   createdAt DateTime @default(now())
//   remark String @default("")
//   review String @default("")
//   score Int @default(0) 
//   filePath String

// // task Relation with the submission!!!
//   taskId String
//   task Task @relation(fields: [taskId],references: [taskId])

//   studentId String
//   student Users @relation(fields: [studentId],references: [clerkId])
//   @@index([taskId])
//   @@index([studentId])
// }

interface TaskSubmission{
    taskId:string,
    studentId:string,
    remark?:string
}

export const SubmitTaskController:RequestHandler = async (req:Request<{},{},TaskSubmission>,res:Response)=>{
    try {
        const {taskId,studentId,remark} = req.body;
        const filePath = req.file?.filename;
        console.log(filePath,taskId,studentId,remark);
        // Validate input
        if(!taskId || !studentId || !filePath){
            res.status(400).json({msg:"Missing required fields"});
            return;
        }

        // Check if task exists
        const task = await prisma.task.findUnique({
            where:{taskId}
        });
        if(!task){
            res.status(404).json({msg:"Task not found"});
            return;
        }


        // Check if student exists
        const student = await prisma.users.findUnique({
            where:{clerkId:studentId,role:"STUDENT"}
        });
        if(!student){
            res.status(404).json({msg:"Student not found"});
            return;
        }


        // Check if submission already exists
        const existingSubmission = await prisma.taskSubmission.findFirst({
            where:{taskId,studentId}
        });
        if(existingSubmission){
            res.status(400).json({msg:"Submission already exists"});
            return;
        }

        // Add submission to database
        const newSubmission = await prisma.taskSubmission.create({
            data:{
                taskId,
                studentId,
                filePath,
                remark:remark || ""
            }
        });
        res.status(201).json({msg:"Submission added successfully",submission:newSubmission});
        return;
    } catch (error) {
        console.error("Error in SubmitTaskController:", error);
        res.status(500).json({msg:"Internal server error"});
        return;
    }
};


export const ReviewSubmissionController:RequestHandler = async (req:Request<{},{},{submissionId:string,review:string,score:number}>,res:Response)=>{
    try {
        const {submissionId,review,score} = req.body;
        // Validate input
        if(!submissionId || !review || score===undefined){
            res.status(400).json({msg:"Missing required fields"});
            return;
        }
        if(score<0 || score>100){
            res.status(400).json({msg:"Score must be between 0 and 100"});
            return;
        }

        // Check if submission exists
        const submission = await prisma.taskSubmission.findUnique({
            where:{submissionId}
        });
        if(!submission){
            res.status(404).json({msg:"Submission not found"});
            return;
        }

        // Update submission in database
        const updatedSubmission = await prisma.taskSubmission.update({
            where:{submissionId},
            data:{
                review,
                score
            }
        });

        res.status(200).json({msg:"Submission reviewed successfully",submission:updatedSubmission});
        return;
    } catch (error) {
        console.error("Error in ReviewSubmissionController:", error);
        res.status(500).json({msg:"Internal server error"});
        return;
    }
};

export const GetSubmissionsByTaskController = async (req:Request<{taskId:string,userId:string},{},{}>,res:Response)=>{
    try {
        const {taskId} = req.params;
        // Check if task exists
        const task = await prisma.task.findUnique({
            where:{taskId}
        });
        if(!task){
            res.status(404).json({msg:"Task not found"});
            return;
        }

        // Get submissions from database
        const submissions = await prisma.taskSubmission.findMany({
            where:{taskId},
            include:{
                student:{
                    select:{
                        name:true
                    }
                }
            }
            
        });

        res.status(200).json({msg:"Submissions fetched successfully",submissions});
        return;
    } catch (error) {
        console.error("Error in GetSubmissionsByTaskController:", error);
        res.status(500).json({msg:"Internal server error"});
        return;
    }
};
