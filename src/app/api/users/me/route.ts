import { NextRequest, NextResponse } from "next/server"; 
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { withAuth } from "@/lib/auth-middleware";

async function getHandler(req: any) {
  try {
    await connectDB();

    const _user = req.user as any;
    console.log("🚀 ~ getHandler ~ _user:", _user)

    const foundUser = await User.findById(_user.id).select("-password");
    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: foundUser,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}


export const GET = withAuth(getHandler);
