import express, { Request, Response } from "express";

// importing middlewares..
import pathPrinter from "./middlewares/path";
import bodyParser from "body-parser";
import cors from "cors";

// impoting the routers...
import signupRouter from "./router/signupRoute";
import userRouter from "./router/userRouter";

let app=express();

const FrontEndUrl=process.env.FRONTEND_URL || "http://localhost:3000";

// middlewares...
app.use(cors({
  origin: FrontEndUrl, // URL
  methods: ["GET", "POST", "PUT","PATCH" ,"DELETE"],
  credentials: true 
}));


app.use(express.json());
app.use(pathPrinter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/signup',signupRouter);
app.use('/users',userRouter);


app.get("/",async (req:Request,res:Response)=>{
    res.status(200).send({msg:"Hello from Server"});
})

// starting the server!!!
app.listen(5000,()=>{
    console.log("Server was started.");
})