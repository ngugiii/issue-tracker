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

export async function PUT(
  request,
  { params }
) {
  const id = params.id;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await request.json();

    if (!body) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { assigned, status } = body;

    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: {
        // assigned,
        status,
      },
    });

    return NextResponse.json(updatedIssue, { status: 200 });
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
