import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";

const createIssueSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  assignedUserId: z.string(),
});

export async function POST(request) {
  const body = await request.json();
  const validation = createIssueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const newIssue = await prisma.issue.create({
    data: {
      title: body.title,
      description: body.description,
      assigned: { connect: { id: body.assignedUserId } },
    },
  });
  const user = await prisma.user.findUnique({
    where: { id: body.assignedUserId },
  });

  const updatedUser = await prisma.user.update({
    where: { id: body.assignedUserId },
    data: {
      assignedIssues: {
        connect: [{ id: newIssue.id }],
      },
    },
    include: {
      assignedIssues: true,
    },
  });

  return NextResponse.json({ newIssue, updatedUser }, { status: 201 });
}

export async function GET(request) {
  const allIssues = await prisma.issue.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(allIssues, { status: 200 });
}
