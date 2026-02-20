import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const VALID_TAGS = ["artsy-data", "instagram-data"] as const;
type CacheTag = (typeof VALID_TAGS)[number];

/**
 * On-demand revalidation endpoint.
 *
 * Usage:
 *   POST /api/revalidate
 *   Body: { "tag": "artsy-data", "secret": "<REVALIDATION_SECRET>" }
 *
 * Supports revalidating individual tags or all tags at once (tag: "all").
 * Protected by a shared secret stored in REVALIDATION_SECRET env var.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tag, secret } = body as { tag?: string; secret?: string };

    // Validate secret
    const expected = process.env.REVALIDATION_SECRET;
    if (!expected || secret !== expected) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    // Revalidate all tags
    if (tag === "all") {
      for (const t of VALID_TAGS) revalidateTag(t, "default");
      return NextResponse.json({ revalidated: VALID_TAGS, now: Date.now() });
    }

    // Revalidate a specific tag
    if (!tag || !VALID_TAGS.includes(tag as CacheTag)) {
      return NextResponse.json(
        { error: `Invalid tag. Use: ${VALID_TAGS.join(", ")} or "all"` },
        { status: 400 },
      );
    }

    revalidateTag(tag, "default");
    return NextResponse.json({ revalidated: tag, now: Date.now() });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
