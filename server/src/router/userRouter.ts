
import { Request,RequestHandler,Response } from "express";
import { Router } from "express";
import { getUserController } from "../controller/userController";
const userRouter = Router();

userRouter.get("/:id", getUserController);

export default userRouter;
