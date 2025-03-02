import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../utils/db";
import { z } from "zod";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { getSocketIO } from "../../../../utils/socket";

// Define schema for validation
const postSchema = z.object({
  content: z.string().min(1, "Post cannot be empty"),
});

export async function POST(req: NextRequest) {
  try {
    console.log("🚀 Handling POST request...");

    // Extract token from headers
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("❌ Unauthorized: No Authorization header.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1]; // Format: "Bearer <token>"
    if (!token) {
      console.log("❌ Unauthorized: No token provided.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error("❌ JWT_SECRET is not set in environment variables.");
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("❌ Error verifying token:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decodedToken || typeof decodedToken !== "object" || !decodedToken.id) {
      console.error("❌ Unauthorized: Invalid token structure.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure userId is a string
    const userId = String(decodedToken.id);
    console.log(`✅ User authenticated: ${userId}`);

    // Parse request body
    const body = await req.json();
    const { content } = postSchema.parse(body);

    // Create new post in database
    const newPost = await prisma.post.create({
      data: {
        content,
        userId,
      },
    });
    console.log("✅ New post created:", newPost);

    // Emit WebSocket event
    const io = getSocketIO();
    io.emit("newPost", {
      type: "notification",
      message: "New post created",
      post: newPost,
    });

    console.log("📢 WebSocket notification sent!");

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "your-email@gmail.com",
        pass: process.env.EMAIL_PASSWORD, // Use App Password (not Gmail password)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: process.env.EMAIL_TO || "your-email@gmail.com",
      subject: "New Post Created",
      text: `Your post was created successfully: ${newPost.content}`,
    };

    // Send email notification
    try {
      await transporter.sendMail(mailOptions);
      console.log("📧 Email notification sent successfully.");
    } catch (error) {
      console.log("❌ Error sending email:", error);
    }

    // Return success response
    return NextResponse.json(
      { message: "✅ Post created successfully!", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.log("❌ Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
