import { Request, Response, Router } from "express";
import { demoDemo } from "../controller/demo";
let demoRouter:Router=Router();

demoRouter.post('/',demoDemo);

export default demoRouter;