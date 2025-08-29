
const pathPrinter=(req:any,res:any,next:any)=>{
    console.log("Path:",req.path);
    next();
}

export default pathPrinter;