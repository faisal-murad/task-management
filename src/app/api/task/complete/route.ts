import { withAuth } from "@/lib/auth-middleware";
import { Task } from "@/lib/models/Task";
import { connectDB } from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";


const updateTask = async (req: NextRequest) => {
  await connectDB();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  const { taskId } = body || {};
  console.log("📝 Request body:", body);
  console.log("🔑 Task ID received:", taskId);

  if (!taskId) {
    return NextResponse.json(
      { success: false, message: "Task ID is required" },
      { status: 400 }
    );
  }

  try {
    const foundTask = await Task.findByIdAndUpdate(
      taskId,
      { status: "completed" },
      { new: true }
    );

    if (!foundTask) {
      console.log("⚠️ Task not found in DB for ID:", taskId);
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    console.log("✅ Task updated:", foundTask);
    return NextResponse.json({
      success: true,
      message: "Task marked as completed",
      task: foundTask,
    });
  } catch (err) {
    console.error("❌ DB update error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
};

export const PUT = withAuth(updateTask);