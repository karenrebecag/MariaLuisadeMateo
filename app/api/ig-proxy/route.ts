import { NextRequest, NextResponse } from "next/server";

/**
 * Image proxy for Instagram CDN.
 * Instagram sets Cross-Origin-Resource-Policy: same-origin, so browsers block
 * direct <img> loads from other origins. This route fetches the image server-side
 * and re-serves it with cross-origin headers.
 *
 * Only Instagram CDN hostnames are allowed — all other URLs are rejected.
 */

const ALLOWED_HOSTS = ["cdninstagram.com", "fbcdn.net"];

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
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        Referer: "https://www.instagram.com/",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream ${upstream.status}` },
        { status: upstream.status }
      );
    }

    const body = await upstream.arrayBuffer();
    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        // Cache aggressively — Instagram CDN URLs are content-addressed
        "Cache-Control": "public, max-age=86400, s-maxage=86400, immutable",
        "Cross-Origin-Resource-Policy": "cross-origin",
      },
    });
  } catch {
    return NextResponse.json({ error: "Proxy failed" }, { status: 502 });
  }
}
