import { NextResponse } from "next/server";

export async function POST() { 
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
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
