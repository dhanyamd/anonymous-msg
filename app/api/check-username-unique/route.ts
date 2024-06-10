import dbConnect from "@/lib/dbConnect";
import {z} from "zod";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/SignupSchema";

const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request: Request){
    if(request.method !== 'GET'){
        return Response.json({
            success: false,
            message: "Method not allowed"
        },{status:405})
    }
  await dbConnect();

  try{
    const {searchParams} = new URL(request.url);
    const queryParam = {
        username : searchParams.get('username')
    }
    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam)
    if(!result.success){
        const usernameErrors = result.error.format().username?._errors || []
        return Response.json({
            success : false,
            message : usernameErrors?.length > 0 ? usernameErrors.join(',') : "Invalid query parameters"
        },{
            status : 403
        })     
    }
    const {username} = result.data;
    const ExistingVerfiedUser = await UserModel.findOne({username, isVerified: true})
    if(ExistingVerfiedUser){
        return Response.json({
            success: false,
            message : "Username is already taken"
        })
    }
    return Response.json({
        success: true,
        message: "Username is unique"
    })
  }catch(error){
    console.error("Error while checking username", error)
    return Response.json({
        success : false,
        message : "Error while checking username"
    })
  }
}