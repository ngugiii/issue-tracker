import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";


const createUserSchema = z.object({
    userName: z.string().min(1).max(255),
    email: z.string().min(1),
    password: z.string().min(1)
})

export async function POST(request) {
    const body = await request.json();
    const validation = createUserSchema.safeParse(body);
  
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }
  
    const { userName, email, password } = body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.findUnique({
        where:{
            email:email
        }
      })

      if(user){
      return NextResponse.json({ error: "Email Already Exists" }, { status: 400 });
      }
  
      const newUser = await prisma.user.create({
        data: {
          userName,
          email,
          password: hashedPassword,
          assignedIssues: { 
            create: [] 
          }        },
      });
  
      return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
  }