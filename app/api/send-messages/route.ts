import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/User";

export async function POST(request: Request){
    await dbConnect()
  const {username, content} = await request.json();
  try{
    const user = await UserModel.findOne({username})
    if(!user){
        return Response.json({
            success: false,
            message : "User not found"
        },{status: 403})
    }
    //is user accepting messages? 
    if(!user.isAcceptingMessages){
        return Response.json({
            success: false,
            message : "User is not accepting messages"
        },{status: 402})
    }
    const newMessages = {content, createdAt : new Date()}
    user.messages.push(newMessages as Message)
    await user.save();
    return Response.json({
      success: true,
      message : "message sent successfully"  
    }),{status: 400}
  }catch(error){
    console.log("something went wrong", error)
    return Response.json({
        success: false,
        message : "Unexpected error"
    },{status: 402})
  }
  
}