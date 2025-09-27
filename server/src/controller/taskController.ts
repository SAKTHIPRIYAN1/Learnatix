
import { Request,Response,RequestHandler } from "express";

import prisma from "../prisma";

import {getIO} from "../socket";


type Task={
    name:string,
    description:string,
    dueDate:Date,
    teacherId:string,
    classId:string
}

export const AddTaskController:RequestHandler = async (req:Request<{},{},Task>,res:Response)=>{
    try {
        const {name,description,dueDate,teacherId,classId} = req.body;
        
        const filePath = req.file?.filename;
        // Validate input
        if(!name || !description || !dueDate || !filePath || !teacherId || !classId){
             res.status(400).json({msg:"Missing required fields"});
             return;
        }
        // Check if teacher exists
        const teacher = await prisma.classRoomParticipant.findFirst({
            where:{userId:teacherId,role:"TEACHER",roomId:classId}
        });
        if(!teacher){
            res.status(404).json({msg:"Teacher not found"});
            return;
        }
        // Add task to database
        const newTask = await prisma.task.create({
            data:{
                name,
                description,
                dueDate,
                filePath,
                teacherId,
                classId
            }
        });

        // sending through the Socket!!!
        const io=getIO();
        io.to(classId).emit("addTask",{ task:newTask,classId,senderId:teacherId });

        res.status(201).json({msg:"Task added successfully",task:newTask});
        return;
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({msg:"Internal server error"});
        return;
    }
};

export const GetTasksByClassController = async (req:Request<{classId:string,userId:string},{},{}>,res:Response)=>{
    try {
        const {classId,userId} = req.params;
        // Check if user is a teacher in the class
        const user = await prisma.classRoomParticipant.findFirst({
            where:{userId,roomId:classId}
        });

        if(!user){
            res.status(404).json({msg:"User not found"});
            return;
        }

        // Get tasks for the class
        const tasks = await prisma.task.findMany({
            where:{classId},
            include:{
                submission:{
                    include:{
                        student:{
                            select:{name:true}
                        },
                    },
                }
            }
        });

        res.status(200).json({msg:"Tasks retrieved successfully",tasks});
        return;
    } catch (error) {
        console.error("Error retrieving tasks:", error);
        res.status(500).json({msg:"Internal server error"});
        return;
    }
};

export const DeleteTaskController = async (req:Request<{taskId:string,userId:string,classId:string},{},{}>,res:Response)=>{
    try {
        const {taskId,userId,classId} = req.params;
        // Check if user is a teacher in the class
        const user = await prisma.classRoomParticipant.findFirst({
            where:{userId,role:"TEACHER",roomId:classId}
        });

        if(!user){
            res.status(404).json({msg:"User not found"});
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

        // Delete task
        await prisma.task.delete({
            where:{taskId}
        });

        // sending through the Socket!!!
        const io=getIO();
        io.to(classId).emit("deleteTask",{ taskId,classId,senderId:userId });
        res.status(200).json({msg:"Task deleted successfully"});
        return;
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({msg:"Internal server error"});
        return;
    }
};

