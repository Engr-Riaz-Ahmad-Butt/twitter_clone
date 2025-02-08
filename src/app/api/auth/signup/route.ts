import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../../../utils/db";
import { z } from "zod";

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json(
      { user, message: "Signup successful" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Signup failed" }, { status: 400 });
  }
}
