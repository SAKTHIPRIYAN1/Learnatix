import prisma from "../prisma";
import { Request, Response } from "express";

const getUserData = async (userId: string) => {
  const user = await prisma.users.findUnique({
    where: { clerkId: userId },
  });
  return user;
};

const getUserController = async (req: Request, res: Response) => {
  const clerkId = req.params.id;
  try {
    const user = await getUserData(clerkId);
    if (user) {
        console.log("User found:", user);
      res.status(200).json(user); 
      return;
    } else {
        console.log("User not found for ID:", clerkId);
      res.status(404).json({ message: "User not found" });
      return;
    }
  } catch (error) {
    console.log("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export { getUserController };
