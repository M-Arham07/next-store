import ConnectDB from "@/backend-utilities/ConnectDB";
import ManageUsersPage from "@/components/admin/manage-userspage/manage-users-page";
import mongoose from "mongoose";
import Users from "@/backend-utilities/models/UserModel";



export default async function MANAGE_USERS_PAGE(){

  await ConnectDB();
  const rawUsers = await Users.find();
  const parsedUsers = JSON.parse(JSON.stringify(rawUsers));
 
  

  return <ManageUsersPage ALL_USERS={parsedUsers}/>
}