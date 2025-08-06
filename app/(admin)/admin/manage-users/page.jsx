import ConnectDB from "@/backend-utilities/ConnectDB";
import ManageUsersPage from "@/components/admin/manage-userspage/manage-users-page";
import mongoose from "mongoose";
import Users from "@/backend-utilities/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";



export default async function MANAGE_USERS_PAGE() {

  const session = await getServerSession(authOptions);


  await ConnectDB();
  const rawUsers = await Users.find().lean();
  const parsedUsers = JSON.parse(JSON.stringify(rawUsers));

  // TO FIND SUPERUSER:
  // console.log("RECEIEVD SU:",parsedUsers.filter(user=>user.isSuperuser === true))

 
  const isSU = parsedUsers.some(user=>user?.isSuperuser && user?.email === session?.user?.email);



  return <ManageUsersPage ALL_USERS={parsedUsers} SU={isSU} />
}