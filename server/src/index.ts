import express, { Request, Response } from "express";

// importing middlewares..
import pathPrinter from "./middlewares/path";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

// impoting the routers...
import signupRouter from "./router/signupRoute";
import userRouter from "./router/userRoute";
import classRouter from "./router/classRoute";
import chatRouter from "./router/chatRouter";
import participantRouter from "./router/participantRoute";
import notesRouter from "./router/notesRoute";



// importing the Socket ..
import { initSocket } from "./socket";



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

// routers mappings!!!
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use('/signup',signupRouter);
app.use('/users',userRouter);
app.use('/class',classRouter);
app.use('/chat',chatRouter);
app.use('/participants',participantRouter);
app.use('/notes',notesRouter);


app.get("/",async (req:Request,res:Response)=>{
    res.status(200).send({msg:"Hello from Server"});
})

// --- Start HTTP + Socket.IO server ---
const server = initSocket(app);

const PORT=process.env.PORT || "5000";

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});