import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      const response = NextResponse.json(
        { message: "No refresh token found" },
        { status: 401 }
      );
      response.cookies.set("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        expires: new Date(0),
      }); 
      return response;
    }

    let payload: any;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!);
    } catch (err) {
      const response = NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
        response.cookies.set("refreshToken", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "strict",
          expires: new Date(0),
        });
        return response;
    }

    // Find user in DB
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      {
        accessToken,
        user: { id: user._id, email: user.email, role: user.role },
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
