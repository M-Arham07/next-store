import mongoose, { mongo } from "mongoose";

export default async function ConnectDB() {

    try {
        await mongoose.connect(process.env.DB_URI);
        if(process.env.NODE_ENV === 'development') mongoose.set('debug',true);
        console.log("Connected to Database successfully!");
    }
    catch (err) {
        console.error("Failed Connecting to Database! Logs:", err);
        throw err;

    }


}
