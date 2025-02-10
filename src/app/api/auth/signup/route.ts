import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../../../utils/db";
import { z } from "zod";
import jwt from "jsonwebtoken";

const userSchema = z.object({
  name: z.string().min(3, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = userSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );

      // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: parseInt(process.env.JWT_EXPIRES_IN || "604800") }
    );

    return NextResponse.json(
      { user, token, message: "Signup successful" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Signup failed" }, { status: 400 });
  }
}
