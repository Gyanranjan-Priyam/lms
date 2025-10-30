import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    console.log("Simple Profile API: Starting fetch");
    
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    console.log("Simple Profile API: Session user ID:", session.user.id);

    // Get user with only the basic fields that definitely exist
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    console.log("Simple Profile API: User found:", !!user, user?.role);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    // Return user data with safe defaults for potentially missing fields
    const profileData = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: (user as any).username || null,
      image: user.image || null,
      bio: (user as any).bio || null,
      phone: (user as any).phone || null,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      emailVerified: user.emailVerified,
    };
    return NextResponse.json(profileData);
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}