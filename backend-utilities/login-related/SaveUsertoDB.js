import ConnectDB from "@/backend-utilities/ConnectDB";
import User from "@/backend-utilities/models/UserModel"
import mongoose from 'mongoose';

// Default value is placeholder.svg for profile pic

export default async function SaveUsertoDB({name,email,image = "/placeholder.svg?height=48&width=48"}){

    try{
    await ConnectDB();
    
    const doesExist = await User.findOne({email:email});

    if(doesExist) return true; // if already exist so no need to create a new user

    const isInserted = await User.create({name:name,email:email,image:image});
    return true;
    }
    catch(err){
        console.error("Failed inserting user at SaveUsertoDB. Logs: ",err.message);
        return false;

    }
    

}