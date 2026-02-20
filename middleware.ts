import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add CDN cache headers for image proxy routes
  if (pathname.startsWith("/api/ig-proxy") || pathname.startsWith("/api/artsy-proxy")) {
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=7200",
    );
    return response;
  }

  // i18n routing for everything else
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
