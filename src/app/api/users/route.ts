import { NextResponse } from "next/server"; 
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { withAuth } from "@/lib/auth-middleware";


// Handle GET request (fetch users)
async function getUsers(req:any) {
  await connectDB();

  const _user = req.user;
  console.log("🚀 ~ GET ~ _user:", _user)

  const users = await User.find({_id:{$ne:_user._id}});
  return NextResponse.json(users);
}
 
export const GET = withAuth(getUsers);