export interface InstagramPost {
  src: string;
  alt: string;
  caption?: string;
  date?: string;
  link: string;
}

/**
 * Fetches recent posts from a public Instagram profile.
 * Uses the unofficial web_profile_info endpoint (requires x-ig-app-id header).
 * Returns null on any failure so callers can use a static fallback.
 * Cached for 1 hour via Next.js fetch revalidation.
 */
export async function getInstagramPosts(
  username: string
): Promise<InstagramPost[] | null> {
  try {
    const res = await fetch(
      `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
          "x-ig-app-id": "936619743392459",
          Accept: "application/json, */*",
          "Accept-Language": "es-MX,es;q=0.9,en;q=0.8",
          Referer: "https://www.instagram.com/",
        },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 3600, tags: ["instagram-data"] },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const edges: unknown[] =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any)?.data?.user?.edge_owner_to_timeline_media?.edges ?? [];

    if (!edges.length) return null;

    return edges.slice(0, 12).map((edge: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const node = (edge as any).node;
      const caption: string =
        node?.edge_media_to_caption?.edges?.[0]?.node?.text ?? "";
      const text = caption.slice(0, 120) || "Obra de María Luisa de Mateo";
      const timestamp = node?.taken_at_timestamp as number | undefined;
      const date = timestamp
        ? new Date(timestamp * 1000).toISOString().slice(0, 10)
        : undefined;
      return {
        // Route through our proxy to bypass Instagram CDN's CORP header
        src: `/api/ig-proxy?url=${encodeURIComponent(node.display_url as string)}`,
        alt: text,
        caption: text,
        date,
        link: `https://www.instagram.com/p/${node.shortcode}/`,
      };
    });
  } catch {
    return null;
  }
}
