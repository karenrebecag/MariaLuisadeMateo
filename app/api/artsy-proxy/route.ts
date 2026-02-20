import { NextRequest, NextResponse } from "next/server";

/**
 * Image proxy for Artsy CDN.
 * Artsy images may have CORS restrictions — this route fetches server-side
 * and re-serves with cross-origin headers, same pattern as ig-proxy.
 */

const ALLOWED_HOSTS = ["d32dm0rphc51dk.cloudfront.net"];

function isAllowed(raw: string): boolean {
  try {
    const { hostname } = new URL(raw);
    return ALLOWED_HOSTS.some((h) => hostname.endsWith(h));
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  const src = decodeURIComponent(raw);

  if (!isAllowed(src)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const upstream = await fetch(src, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream ${upstream.status}` },
        { status: upstream.status },
      );
    }

    const body = await upstream.arrayBuffer();
    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, immutable",
        "Cross-Origin-Resource-Policy": "cross-origin",
      },
    });
  } catch {
    return NextResponse.json({ error: "Proxy failed" }, { status: 502 });
  }
}
