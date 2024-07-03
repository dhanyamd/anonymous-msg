import { getServerSession} from "next-auth";
import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(){
    await dbConnect();

    const session = await getServerSession(AuthOptions) 
    const user: User = session?.user
    if(!session && !user){
        return Response.json({
            success: false,
            message: "Not authenticated"
        },{status: 401})
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try{
     const user = await UserModel.aggregate([
        {$match: {_id : userId}},
        {$unwind: '$messages'},
        {$sort: {'messages.createdAt': -1}},
        {$group: {_id: '$_id', messages: {$push: '$messages'}}}
     ])
     if(!user || user.length === 0){
        return Response.json({
            success: false,
            message: "User not found"
        },{status: 401})
     }
     return Response.json({
        success: true,
        messages : user[0].messages
     },{status : 200})
    }catch(error){
        console.log("unexpected error", error)
        return Response.json({
            success: false,
            message : "Unexpected error"
        },{status: 500})
    }
 
}