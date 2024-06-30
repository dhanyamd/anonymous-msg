import { getServerSession} from "next-auth";
import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request){
    await dbConnect();

    const session = await getServerSession(AuthOptions) 
    const user: User = session?.user
    if(!session && !user){
        return Response.json({
            success: false,
            message: "Not authenticated"
        },{status: 401})
    }

    const userId = user._id
    const {acceptmessages} = await request.json()
    try{
     const updatedUser =  await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages: acceptmessages},
            {new : true}
        )
    if(!updatedUser){
        return Response.json({
            success: false,
            message: "Not authenticated"
        },{status: 401})
    }
    return Response.json({
        success: true,
        message: "updated status of the user successfully",
        updatedUser
    },{status:200 })
       
    }catch(error){
        console.log("failed to update user status to accept messages")
        return Response.json({
            success: false,
            message: "Not authenticated"
        },{status: 404})

    }
}

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(AuthOptions) 
    const user: User = session?.user
    if(!session && !user){
        return Response.json({
            success: false,
            message: "Not authenticated"
        },{status: 401})
    }

    const userId = user._id
    try{
    const foundUser = await UserModel.findById(userId)
    if(!foundUser){
        return Response.json({
            success: false,
            message: "User not found"
        },{status: 401})
    }
    return Response.json({
        success: true,
        isAcceptingMessages : foundUser.isAcceptingMessages
        },{status: 200})
 } catch(error){
    console.log("error while fetching messages")
        return Response.json({
            success: false,
            message: "error while fetching messages"
                },{status: 500})
}
}

