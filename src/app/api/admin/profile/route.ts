import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email is required"),
  username: z.string().min(3, "Username must be at least 3 characters").max(50).optional().nullable(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional().nullable(),
  phone: z.string().optional().nullable(),
  image: z.string().url("Valid image URL required").optional().nullable(),
});

export async function GET() {
  try {
    console.log("Admin Profile API: Starting fetch");
    
    const session = await auth.api.getSession({
      headers: await headers()
    });

    console.log("Admin Profile API: Session check", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id
    });

    if (!session?.user) {
      console.log("Admin Profile API: No authentication");
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    console.log("Admin Profile API: Querying database for user");
    
    // First, try to get basic user info to check if user exists
    const basicUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
      }
    });

    console.log("Admin Profile API: Basic user query result", {
      hasUser: !!basicUser,
      role: basicUser?.role,
      name: basicUser?.name
    });

    if (!basicUser) {
      console.log("Admin Profile API: User not found in database");
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    if (basicUser.role !== "admin") {
      console.log("Admin Profile API: Access denied - not admin", {
        role: basicUser.role
      });
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    // Now try to get full user info including new fields
    let fullUser;
    try {
      fullUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          image: true,
          bio: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          emailVerified: true,
        }
      });
    } catch (fullUserError) {
      console.log("Admin Profile API: Error querying full user, falling back to basic user", fullUserError);
      // If new fields don't exist, return basic user info with default values
      fullUser = {
        ...basicUser,
        username: null,
        image: null,
        bio: null,
        phone: null,
      };
    }

    console.log("Admin Profile API: Returning user data");
    return NextResponse.json(fullUser);
  } catch (error) {
    console.error("Admin Profile API: Error fetching admin profile:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Check if email is already taken by another user
    if (validatedData.email) {
      const existingEmailUser = await prisma.user.findFirst({
        where: {
          email: validatedData.email,
          id: { not: session.user.id }
        }
      });

      if (existingEmailUser) {
        return NextResponse.json(
          { error: "Email is already taken by another user" },
          { status: 400 }
        );
      }
    }

    // Check if username is already taken by another user
    if (validatedData.username) {
      const existingUsernameUser = await prisma.user.findFirst({
        where: {
          username: validatedData.username,
          id: { not: session.user.id }
        }
      });

      if (existingUsernameUser) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 }
        );
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        username: validatedData.username,
        bio: validatedData.bio,
        phone: validatedData.phone,
        image: validatedData.image,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        bio: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
      }
    });

    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: updatedUser 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating admin profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}