import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../../../utils/db";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

    return NextResponse.json({ message: "Login successful", user }, { status: 200 });
  } catch{
    return NextResponse.json({ error: "Login failed" }, { status: 400 });
  }
}
