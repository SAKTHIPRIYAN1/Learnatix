import express, { Request, Response } from "express";

// importing middlewares..
import pathPrinter from "./middlewares/path";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

// impoting the routers...
import signupRouter from "./router/signupRoute";
import userRouter from "./router/userRouter";
import classRouter from "./router/classRoute";



let app=express();

const FrontEndUrl=process.env.FRONTEND_URL || "http://localhost:3000";

// middlewares...
app.use(cors({
  origin: FrontEndUrl, // URL
  methods: ["GET", "POST", "PUT","PATCH" ,"DELETE"],
  credentials: true
}));


// Parse JSON body
app.use(express.json());

// Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

app.use(pathPrinter);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use('/signup',signupRouter);
app.use('/users',userRouter);
app.use('/class',classRouter);


app.get("/",async (req:Request,res:Response)=>{
    res.status(200).send({msg:"Hello from Server"});
})

// starting the server!!!
app.listen(5000,()=>{
    console.log("Server was started.");
})