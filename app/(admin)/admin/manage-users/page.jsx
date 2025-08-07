import ConnectDB from "@/backend-utilities/ConnectDB";
import ManageUsersPage from "@/components/admin/manage-userspage/manage-users-page";
import mongoose from "mongoose";
import Users from "@/backend-utilities/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GetAllUsers from "@/backend-utilities/GetAllUsers";



export default async function MANAGE_USERS_PAGE() {

  const session = await getServerSession(authOptions);

  const allUsers = await GetAllUsers();
  
  // TO FIND SUPERUSER:
  // console.log("RECEIEVD SU:",allUsers.filter(user=>user.isSuperuser === true))


  const isSU = allUsers.some(user => session.user.email === user.email && user.role === 'superuser');



  return <ManageUsersPage ALL_USERS={allUsers || []} SU={isSU} />
}