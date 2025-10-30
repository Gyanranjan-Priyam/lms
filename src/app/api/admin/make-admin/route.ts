import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export async function GET() {
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      session: {
        userId: session.user.id,
        userEmail: session.user.email,
        userName: session.user.name,
      },
      user: user || "User not found in database",
      isAdmin: user?.role === "admin"
    });
  } catch (error) {
    console.error("Error in current user API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST() {
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

    console.log("Making user admin:", session.user.id);

    // Make current user admin
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "admin" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    console.log("User role updated:", updatedUser);

    return NextResponse.json({
      message: "User role updated to admin",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}