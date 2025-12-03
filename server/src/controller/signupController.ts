import { Request, Response, RequestHandler } from "express";

import prisma from "../prisma";

import { Role } from "@prisma/client";

interface UserType {
  clerkId: string;
  name:string;
  email: string;
  role: "TEACHER" | "STUDENT";
}

const saltRounds = 10;

const SignupController: RequestHandler = async (req: Request<{},{},UserType>, res: Response) => {
  const { clerkId, email, role,name } = req.body ;

//   creating a new user in the database
  try {
    console.log(role);
    if (!Object.values(Role).includes(role)) {
    
      res.status(400).json({ error: "Invalid role provided" });
      return;
    }
    
    const existingUser = await prisma.users.findUnique({
      where: { clerkId },
    });
    if (existingUser) {
      res.status(200).json({ message: "User already exists", user: existingUser });
      return;
    }

    // Create new user
    const newUser = await prisma.users.create({
      data: {
        name,
        clerkId,
        email,
        role
      },
    });

    res.status(200).json(newUser);
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to create User" });
    return;
  }
};




export default SignupController;
