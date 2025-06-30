import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse, userAgent } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
  '/dashboard__(.*)',
  '/me(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect()
  } 
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};