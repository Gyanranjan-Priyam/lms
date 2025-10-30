import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};

export default async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);

	// Only check auth for protected routes
	if (request.nextUrl.pathname.startsWith("/admin") || 
	    request.nextUrl.pathname.startsWith("/dashboard")) {
		
		if (!sessionCookie) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	return NextResponse.next();
}