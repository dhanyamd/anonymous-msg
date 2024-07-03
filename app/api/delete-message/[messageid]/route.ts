import { getServerSession} from "next-auth";
import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { AuthOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: Request, {params}: {params : {messageid : string}}){
    const messageId = params.messageid
    await dbConnect();

    const session = await getServerSession(AuthOptions) 
    const user: User = session?.user
    if(!session && !user){
        return Response.json({
            success: false,
            message: "Not authenticated"
        },{status: 401})
    }

    try{
      const updatedResult = await UserModel.updateOne(
            {_id : user._id },
            {$pull : {messages : { _id : messageId}}}
        )
        if(updatedResult.modifiedCount = 0){
            return Response.json({
                success : false,
                message: "Message not found or already deleted"
            },{status: 402})
        }
        return Response.json({
            success: true,
            message: "Message deleted successfully"
        },{status: 201})

    }catch(error){
        console.log("error in delete message route", error)
        return Response.json({
            success: false,
            message: "Not authenticated"
        },{status: 500})

    }

   
 
}