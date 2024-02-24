import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request) {
  const body = await request.json();

  try {
    // Validate request body
    const { email, password } = LoginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.status(401).json({ error: "Invalid credentials" });
    }

    // Determine user role
    let role = "user";
    if (user.email === "admin@gmail.com") {
      role = "admin";
    }

    // Generate access token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role },
      process.env.JWT_SECRET || "",
      { expiresIn: "1h" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET || "",
      { expiresIn: "7d" }
    );

    // Return user data and tokens
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.status(500).json({ error: "Internal server error" });
  }
}
