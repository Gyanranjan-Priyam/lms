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
    console.log("User Profile API: Starting fetch");
    
    const session = await auth.api.getSession({
      headers: await headers()
    });

    console.log("User Profile API: Session check", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id
    });

    if (!session?.user) {
      console.log("User Profile API: No authentication");
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    console.log("User Profile API: Querying database for user");
    
    // Get user with all available fields
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    console.log("User Profile API: User query result", {
      hasUser: !!user,
      role: user?.role,
      name: user?.name
    });

    if (!user) {
      console.log("User Profile API: User not found in database");
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Return user data safely, checking for field existence
    const profileData = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: (user as any).username || null,
      image: user.image || null,
      bio: (user as any).bio || null,
      phone: (user as any).phone || null,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      emailVerified: user.emailVerified,
    };

    console.log("User Profile API: Returning profile data");
    return NextResponse.json(profileData);
  } catch (error) {
    console.error("User Profile API: Error fetching user profile:", error);
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

    // Verify user exists
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
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
    const updateData: any = {
      name: validatedData.name,
      email: validatedData.email,
      updatedAt: new Date(),
    };

    // Only include fields that exist in the schema
    if (validatedData.username !== undefined) updateData.username = validatedData.username;
    if (validatedData.bio !== undefined) updateData.bio = validatedData.bio;
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone;
    if (validatedData.image !== undefined) updateData.image = validatedData.image;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // Return user data safely
    const responseData = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      username: (updatedUser as any).username || null,
      image: updatedUser.image || null,
      bio: (updatedUser as any).bio || null,
      phone: (updatedUser as any).phone || null,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      emailVerified: updatedUser.emailVerified,
    };

    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: responseData 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}