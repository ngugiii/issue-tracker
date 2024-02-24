import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";


export async function GET(
  request,
  { params }
) {
  const id = params.id;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const issue = await prisma.issue.findUnique({
    where: {
      id: id,
    },
  });

  if (issue) {
    return NextResponse.json(issue, { status: 200 });
  } else {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  const id = params.id;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await request.json();

    if (!body) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { assignedUserId, status } = body;

    // Update the issue with assignedUserId and status
    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: {
        assigned: { connect: { id: assignedUserId } }, // Connect the issue to the user
        status,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: assignedUserId },
    });
    
    const updatedUser = await prisma.user.update({
      where: { id: assignedUserId },
      data: {
        assignedIssues: {
          connect: [{ id: id }],
        },
      },
      include: {
        assignedIssues: true,
      },
    })
    return NextResponse.json({ updatedIssue, updatedUser }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Issue update failed" }, { status: 500 });
  }
}


export async function DELETE(
  request,
  { params }
) {
  const id = params.id;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.issue.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json("Issue Deleted Successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Issue delete failed" }, { status: 500 });
  }
}
