
import { Response,Request} from "express";

type paramsType={
    id:number
}

export const cont=(req:Request<paramsType>,res:Response)=>{
    console.log(req.params);
    const {id}:paramsType=req.params;
    console.log(typeof id);
    console.log(req.query);
    res.send({msg:id});
}


interface summa{
    name:string,
    age:number
}

export const demoDemo=(req:Request<{},{},summa>,res:Response<summa>)=>{
    const resi=req.body;
    console.log(resi);
    res.status(200).send({age:10,name:'sa'});

}