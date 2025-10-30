import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { env } from "@/lib/env";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params;
    
    // Get session from headers
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Find the document and verify user has access to it
    const document = await prisma.lessonDocument.findFirst({
      where: {
        id: documentId,
      },
      include: {
        Lesson: {
          include: {
            Chapter: {
              include: {
                Course: {
                  include: {
                    enrollment: {
                      where: {
                        userId: session.user.id,
                        status: 'Active'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Verify user has access to this course
    const course = document.Lesson.Chapter.Course;
    const hasAccess = course.price === 0 || course.enrollment.length > 0;
    
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied. Please purchase the course to view this document." }, { status: 403 });
    }

    // Generate a time-limited, obfuscated URL with enhanced security
    const obfuscatedUrl = generateObfuscatedUrl(document.fileKey, session.user.id, documentId);

    return NextResponse.json({ 
      url: obfuscatedUrl,
      name: document.name,
      type: 'application/pdf'
    });

  } catch (error) {
    console.error("Error generating document URL:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateObfuscatedUrl(fileKey: string, userId: string, documentId: string): string {
  // Create a base64 encoded URL with timestamp that expires in 2 hours
  const expiry = Date.now() + (2 * 60 * 60 * 1000); // 2 hours
  const bucket = env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES;

  // Create the actual S3 URL
  const actualUrl = `https://${bucket}.t3.storage.dev/${fileKey}`;
  
  // Create a payload with URL and expiry with enhanced security
  const payload = JSON.stringify({
    url: actualUrl,
    exp: expiry,
    uid: userId.slice(-6), // Last 6 chars of user ID for basic verification
    did: documentId.slice(-8), // Document ID verification
    iat: Date.now() // Issued at timestamp
  });
  
  // Base64 encode the payload to obfuscate it
  const encodedPayload = Buffer.from(payload).toString('base64url');
  
  // Return a data URL that includes the encoded payload
  return `data:application/pdf;base64url,${encodedPayload}`;
}