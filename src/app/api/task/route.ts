// app/api/tasks/route.ts
import { withAuth } from "@/lib/auth-middleware";
import { Task } from "@/lib/models/Task";
import { IUser, User } from "@/lib/models/User";
import { connectDB } from "@/lib/mongodb";
import { convertToMongoId } from "@/utils/helpers";
import { NextResponse } from "next/server";
import slugify from "slugify";

// ---------------- CREATE TASK ----------------
const createTask = async (req: any) => {
  await connectDB();

  const _user = req.user as IUser;
  const body = await req.json();
  let { title, description, assignedTo, priority } = body;
  console.log("🚀 ~ createTask ~ body:", body)

  title = title?.trim() || null;
  description = description?.trim() || null;
  assignedTo = assignedTo?.trim() || null;

  if (!title) {
    return NextResponse.json(
      {
        success: false,
        message: "Title is required",
      },
      { status: 400 }
    );
  }

  if(assignedTo){
    const assignedUser = await User.findOne({ email: assignedTo?.trim()?.toLowerCase() });
  if (!assignedUser)
    return NextResponse.json(
      {
        success: false,
        message: "Assigned User not found",
      },
      { status: 400 }
    );
    assignedTo = assignedUser._id;
}

  // Generate a unique slug
  const slugBase = slugify(title, { lower: true, strict: true });
  const totalDocuments = await Task.countDocuments();
  const slug = `${slugBase}-${totalDocuments + 1}`;

  const newTask = new Task({
    title,
    description,
    ...(assignedTo ? { assignedTo: assignedTo } : {}),
    createdBy: _user._id,
    priority,
    slug,
  });

  await newTask.save();

  return NextResponse.json({
    success: true,
    message: "Task created successfully",
    task: newTask,
  });
};

// ---------------- GET TASKS ----------------
const getMyTasks = async (req: any) => {
  await connectDB();
  const _user = req.user as IUser;
  console.log("🚀 ~ getMyTasks ~ _user:", _user)


    const { searchParams } = new URL(req.url, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit"));
    const skip = (page - 1) * (limit || 0);
    const isPaginated = skip >= 0 && !!limit;
    
    const search = searchParams.get("search");
    const type = searchParams.get("type") || "all";
    console.log("🚀 ~ getMyTasks ~ type:", type)
  if (type && !["all", "created", "assigned"].includes(type)) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid type parameter. Allowed values are all, created, assigned.",
      },
      { status: 400 }
    );
  }

  const matchQuery: any = {};
  if (type === "all") {
    matchQuery.$or = [
      { createdBy: _user._id },
      { assignedTo: _user._id }
    ];
  } else if (type === "created") {
    matchQuery.createdBy = _user._id;
  } else if (type === "assigned") {
    matchQuery.assignedTo = _user._id;
  }

  if(search?.trim()){
    matchQuery.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } }
    ];
  }

  
  let query = Task.find(matchQuery)
    .sort({ createdAt: -1 })
    .populate({ path: 'createdBy', select: 'fullName email avatar' })
    .populate({ path: 'assignedTo', select: 'fullName email avatar' });

  if (isPaginated) {
    query = query.skip(skip).limit(limit);
  }

  const tasks = await query.exec();
  const totalCount = await Task.countDocuments(matchQuery);

  return NextResponse.json({
    data: tasks,
    totalCount,
    results: tasks.length,
  });
};

// ---------------- UPDATE TASK ----------------
const updateTask = async (req: any) => {
  await connectDB();

  const _user = req.user as IUser;
  const slug = req.query?.slug;

  if (!slug) {
    return NextResponse.json(
      { success: false, message: "Slug is required" },
      { status: 400 }
    );
  }

  const body = req.body;
  if (body.title) body.title = body.title.trim();
  if (body.description) body.description = body.description.trim();
  if (body.assignedTo)
    body.assignedTo = convertToMongoId(body.assignedTo.trim());

  const task = await Task.findOneAndUpdate(
    { slug, createdBy: _user._id },
    body,
    { new: true }
  );
  if (!task) {
    return NextResponse.json(
      { success: false, message: "Task not found or not allowed" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, message: "Task updated", task });
};

// ---------------- DELETE TASK ----------------
const deleteTask = async (req: any) => {
  await connectDB();

  const _user = req.user as IUser;
  const slug = req.query?.slug;

  if (!slug) {
    return NextResponse.json(
      { success: false, message: "Slug is required" },
      { status: 400 }
    );
  }

  const task = await Task.findOneAndDelete({ slug, createdBy: _user._id });
  if (!task) {
    return NextResponse.json(
      { success: false, message: "Task not found or not allowed" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, message: "Task deleted" });
};

// ---------------- EXPORT ----------------
export const POST = withAuth(createTask);
export const GET = withAuth(getMyTasks);
export const PUT = withAuth(updateTask);
export const DELETE = withAuth(deleteTask);
