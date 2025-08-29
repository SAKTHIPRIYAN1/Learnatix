import { Router } from "express";

import SignupController from "../controller/signupController";

const signupRouter:Router=Router();

signupRouter.post('/',SignupController);

export default signupRouter;
