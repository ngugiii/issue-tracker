import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request,
    { params }
  ) {
    const id = params.id;

    console.log("id",id);
  
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
  
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  
    if (user) {
      return NextResponse.json(user, { status: 200 });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  }