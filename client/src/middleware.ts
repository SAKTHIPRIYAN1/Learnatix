import { clerkMiddleware } from '@clerk/nextjs/server';
import { createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/','/sign-up/student', '/sign-in/student', '/sign-up/teacher', '/sign-in/teacher', '/forgot-password', '/reset-password', '/verify-email', '/terms-of-service', '/privacy-policy',
'/sign-up/student/continue',
]);

export default clerkMiddleware(async (auth, req) => {


  if (!isPublicRoute(req)) {
    // await auth.protect();
  }
});



export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};