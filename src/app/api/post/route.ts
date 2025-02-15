import { NextResponse } from "next/server";
import { prisma } from "../../../../utils/db";
import { z } from "zod";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { getSocketIO } from "../../../../utils/socket";


const postSchema = z.object({
  content: z.string().min(1, "Post cannot be empty"),
});

// const io = new Server({
//   cors: {
//     origin: "*", 
//   },
// });

export async function POST(req: Request) {
  try {
    // Extract token from headers
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1]; // Format: "Bearer <token>"
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify JWT token
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
    
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.log("Error verifying token:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decodedToken || typeof decodedToken !== "object" || !decodedToken.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure userId is a string
    const userId = String(decodedToken.id);
    console.log("User ID from Token:", userId);

    // Parse request body
    const body = await req.json();
    const { content } = postSchema.parse(body);

    // Create new post
    const newPost = await prisma.post.create({
      data: {
        content,
        userId,
      },
    });

   
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER || "riazahmadbutt01@gmail.com",
        pass: process.env.EMAIL_PASSWORD, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || "riazahmadbutt01@gmail.com",
      to: process.env.EMAIL_TO || "engr.riazahmadbutt@gmail.com",
      subject: "New Post Created",
      text: `Your post was created successfully: ${newPost.content}`,
    };

    // Send email and emit socket event
    try {
      await transporter.sendMail(mailOptions);
      
      // Emit WebSocket event
      const io = getSocketIO();
      io.emit('newPost', {
        type: 'notification',
        message: 'New post created',
        post: newPost
      });
      
      console.log('Notification sent via WebSocket');
    } catch (error) {
      console.error("Error sending email:", error);
    }

    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 400 });
  }
}
