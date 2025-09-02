import bcrypt from 'bcrypt';

export const hashString=async(str:string,saltRounds:number)=>{
    const hashedString=await bcrypt.hash(str,saltRounds);
    return hashedString;
}

export const deHashCompare=async(og:string,hashedStr:string)=>{
    const res=await bcrypt.compare(og,hashedStr);
    return res;
}