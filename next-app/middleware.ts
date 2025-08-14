import { clerkMiddleware } from "@clerk/nextjs/server";

// This middleware integrates Clerk with the Next.js App Router. It ensures
// authentication metadata is attached to requests and protects API routes.
// The matcher skips Next.js internal assets and runs on all other routes,
// including API and tRPC endpoints. See Clerk docs for details.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files unless requested via a search
    // parameter. This allows Clerk to bypass assets like styles, scripts, and
    // images while still protecting dynamic pages.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run middleware for API and tRPC routes
    "/(api|trpc)(.*)",
  ],
};
