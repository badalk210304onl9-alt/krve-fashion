import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    /*
      Next.js internal files aur static assets ko skip karega.
      Baaki pages aur API routes par Clerk available rahega.
    */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    /*
      API aur TRPC routes par Clerk authentication state available rahegi.
    */
    "/(api|trpc)(.*)",
  ],
};
