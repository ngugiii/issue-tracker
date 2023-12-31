import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
    request,
    { params }
  ) {
    const id = params.id;
    console.log(id);

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        assignedIssues: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.assignedIssues, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch user's issues" }, { status: 500 });
  }
}
