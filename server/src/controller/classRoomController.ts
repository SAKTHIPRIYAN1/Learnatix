
import { Request,Response,RequestHandler } from "express";
import prisma from "../prisma";
import { Role } from "../prisma/prisma";
import crypto from "crypto";

import { hashString } from "../helperFunctions/bycryptFunctions";
import { ClassRoom, Users } from '../prisma/prisma/index';
import { getIO } from "../socket";


type createClassBody={
    className:string,
    description:string,
    teacherName:string,
    teacherId:string,

}




const createClassRoom:RequestHandler=async(req:Request<{},{},createClassBody>,res:Response)=>{
try{
    const {className,teacherName,teacherId,description}=req.body;

    const file=req.file;

    console.log(req.body);
    console.log(file?.filename);
    

    if(!className || !teacherName){
        res.status(400).json({msg:"Missing Common Fieldss"});
        return ;
    }

        const teacher = await prisma.users.findUnique({
        where: { clerkId: teacherId },
        });

        if (!teacher) {
        res.status(404).json({ msg: "Teacher not found" });
        return;
        }


        const token = crypto.randomBytes(32).toString("hex");
        const classRoom = await prisma.classRoom.create({
            data:{
                className,
                description,
                filePath:file?file.filename:null,

                participants:{
                    create:{
                        userId:teacherId,
                        role:"TEACHER",
                    }
                },
                inviteToken:{
                    create:{
                        token
                    }
                }
            },
            include: {
            participants: true,
            inviteToken:true //  return participants too
            },
        });

        const newClassRoom=await prisma.classRoom.findUnique(
            {
                where:{
                    roomId:classRoom.roomId
                },
                include:{
                                participants:{
                                    include:{
                                        user:true
                                    }
                                },
                                inviteToken:true
                }
            }
        );

        const teachers = newClassRoom?.participants.filter((p) => p.role === "TEACHER");
        const filteredClassRoom={
            roomId: classRoom.roomId,
            name: classRoom.className,
            description: classRoom.description,
            teachers,
            pic:classRoom.filePath,
            inviteToken:classRoom.inviteToken[0]
        };

        res.status(201).json({
            msg: "Classroom created successfully",
            classRoom:filteredClassRoom,
            magicspell:token
        });

        return;
    } catch (error) {
    console.error("Error creating classroom:", error);
    res.status(500).json({ msg: "Internal Server Error" });
    return;
  }
}


export const getAllClassRoom:RequestHandler=async(req:Request<{},{},{
    id:string,
    role:Role
}>,res:Response)=>{
    

    try{
        const {id,role}=req.body;
        const enrolledClassRooms=await prisma.users.findUnique({
            where:{clerkId:id},
            include:{
                classrooms:{
                    include:{
                        room:{
                            include:{
                                participants:{
                                    include:{
                                        user:true
                                    }
                                },
                                inviteToken:true
                            }
                        }
                    }
                }
            }
        });

        

        const filteredClassRoom=enrolledClassRooms?.classrooms.map((c)=> {
            const teachers = c.room.participants.filter((p) => p.role === "TEACHER");
            const students = c.room.participants.filter((p) => p.role === "STUDENT");

            return {
                    roomId: c.roomId,
                    name: c.room.className,
                    description: c.room.description,
                    teachers,
                    pic:c.room.filePath,
                    inviteToken:c.room.inviteToken[0]
                }
    });

        
        res.status(200).json({msg:"Data Retrived",classes:filteredClassRoom});
        return;
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg:err});
        return;
    }

}

export const joinClassRoom:RequestHandler=async(req:Request<{},{},{
    userId: string,
    magicSpell:string
}>,res:Response)=>{
    try{
        const {magicSpell,userId}=req.body;
        console.log(magicSpell);
        if(!magicSpell || !userId){
            // console.error("Missing Fields");
            res.status(502).json({ msg: "Missing Fields" });
            return;
        }

        // fetching the roomId from the inviteTokens list...
        const tokenDetails=await prisma.inviteToken.findUnique({
            where:{token:magicSpell},
        })

        console.log(tokenDetails);
        if (!tokenDetails || !tokenDetails.isSharing) {
             res.status(404).json({ msg: "Abracadabra, Invalid Magic Spell" });
             return;
            }

        const existingParticipant = await prisma.classRoomParticipant.findUnique({
        where: {
            userId_roomId: {
            userId,
            roomId: tokenDetails.classId,
            },
        },
        });

        if(existingParticipant){
            res.status(200).json({msg:"Already Joined!"});
        }

    //  adding the joinee to the respected classRoom
    const newparticipant=await prisma.classRoomParticipant.create({
            data:{
                userId,
                roomId:tokenDetails.classId,
                role:"STUDENT"
            },
            include:{
                room:true
            }
    });

     const newClassRoom=await prisma.classRoom.findUnique(
            {
                where:{
                    roomId:tokenDetails.classId
                },
                include:{
                                participants:{
                                    include:{
                                        user:true
                                    }
                                },
                                inviteToken:true
                }
            }
        );

        const teachers = newClassRoom?.participants.filter((p) => p.role === "TEACHER");
        const filteredClassRoom={
            roomId: newClassRoom?.roomId,
            name: newClassRoom?.className,
            description: newClassRoom?.description,
            teachers,
            pic:newClassRoom?.filePath,
            inviteToken:newClassRoom?.inviteToken[0]
        };

        res.status(200).json({msg:"Added to the Class",classRoom:filteredClassRoom});
        return;

    }
    catch(err){
        console.error("Error creating classroom:", err);
        res.status(500).json({ msg: "Internal Server Error" });
        return;
    }
}

export const AlterSharing:RequestHandler=async(req:Request<{},{},{
    userId:string,
    roomId:string,
    token:string,
    sharing:boolean
}>,res)=>{
    try{
        console.log("trying to shre");
       const { userId, roomId, sharing, token } = req.body;

            if (!userId || !roomId || sharing === undefined || !token) {
            res.status(400).json({ msg: "Missing Fields" });
            return;
            }

            // teacher id checkinggg!!!
            const teacherParticipant = await prisma.classRoomParticipant.findFirst({
            where: {
                userId,
                roomId,
                role: "TEACHER",
            },
            });

            if (!teacherParticipant) {
            res.status(403).json({ msg: "Not authorized. Only teacher can update sharing." });
            return;
            }

            console.log(sharing);

            // updation!!!
            const updatedToken = await prisma.inviteToken.updateMany({
            where: {
                classId: roomId,
                token: token,
            },
            data: {
                isSharing: sharing,
            },
            });

            if (updatedToken.count === 0) {
            res.status(404).json({ msg: "Invite token not found" });
            return;
            }

            res.status(200).json({ msg: "Sharing updated successfully", updated: sharing });

            }
            catch(err){
                console.log(err);
                res.status(500).json({msg:"Error Occured At Sharing Altering!!"});
                return;
            }
}

export const DeleteClassController = async (req:Request<{classId:string,userId:string},{},{}>,res:Response)=>{
    try {
        const {userId,classId} = req.params;
        // Check if user is a teacher in the class
        const user = await prisma.classRoomParticipant.findFirst({
            where:{userId,role:"TEACHER",roomId:classId}
        });

        if(!user){
            res.status(404).json({msg:"User not found"});
            return;
        }


       const delClass=await prisma.classRoom.delete({
        where:{
            roomId:classId
        }
       })
        
        // sending through the Socket!!!
        // const io=getIO();
        // io.to(classId).emit("delClass",classId);

        res.status(200).json({msg:"Task deleted successfully"});
        return;

    } catch (error:any) {
        console.error("Error deleting ClassRoom:", error);
        res.status(500).json({msg:error.message || "Internal server error" });
        return;
    }
};

export const LeaveClassController = async (req:Request<{classId:string,userId:string},{},{}>,res:Response)=>{
    try {
        const {userId,classId} = req.params;

        // Check if user is a participant in the class
        const userPart = await prisma.classRoomParticipant.findFirst({
            where:{userId,roomId:classId}
        });

        if(!userPart){
            res.status(404).json({msg:"User not found"});
            return;
        }

      
       const delClassPart=await prisma.classRoomParticipant.delete({
        where:{
            id:userPart?.id
        }
       });
        
        // sending through the Socket!!!
        // const io=getIO();
        // io.to(classId).emit("delClass",classId);

        res.status(200).json({msg:"Leaved successfully"});
        return;

    } catch (error:any) {
        console.error("Error deleting ClassRoom:", error);
        res.status(500).json({msg:error.message || "Internal server error" });
        return;
    }
};


export default createClassRoom;