export interface ArtsyArtwork {
  src: string;
  alt: string;
  slug: string;
  medium: string;
  year: string;
  dimensions: string;
  price: string;
  artsyUrl: string;
}

const ARTSY_GRAPHQL = "https://metaphysics-production.artsy.net/v2";
const ARTIST_SLUG = "de-mateo";

const QUERY = `{
  artist(id: "${ARTIST_SLUG}") {
    artworksConnection(first: 24, sort: CREATED_AT_DESC) {
      edges {
        node {
          title
          date
          medium
          slug
          saleMessage
          image {
            imageURL
            versions
          }
          dimensions {
            cm
          }
        }
      }
    }
  }
}`;

/**
 * Fetches artworks from a public Artsy artist page via their GraphQL endpoint.
 * Returns null on any failure so callers can use a static fallback.
 * Cached for 1 hour via Next.js fetch revalidation.
 */
export async function getArtsyArtworks(): Promise<ArtsyArtwork[] | null> {
  try {
    const t0 = Date.now();
    const res = await fetch(ARTSY_GRAPHQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY }),
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 3600, tags: ["artsy-data"] },
    });

    if (!res.ok) {
      console.warn(`[artsy] HTTP ${res.status} in ${Date.now() - t0}ms`);
      return null;
    }

    const json = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const edges: any[] =
      json?.data?.artist?.artworksConnection?.edges ?? [];

    if (!edges.length) {
      console.warn(`[artsy] No edges returned in ${Date.now() - t0}ms`);
      return null;
    }

    const artworks = edges
      .filter((e) => e.node?.image?.imageURL)
      .map((e) => {
        const n = e.node;
        const imageTemplate: string = n.image.imageURL;
        const versions: string[] = n.image.versions ?? [];
        // Pick best available version
        const version =
          (["larger", "large", "tall", "medium"] as const).find((v) =>
            versions.includes(v),
          ) ?? "square";
        const imageUrl = imageTemplate.replace(":version", version);

        return {
          src: `/api/artsy-proxy?url=${encodeURIComponent(imageUrl)}`,
          alt: n.title ?? "Obra",
          slug: n.slug ?? "",
          medium: n.medium ?? "",
          year: n.date ?? "",
          dimensions: n.dimensions?.cm ?? "",
          price: n.saleMessage ?? "",
          artsyUrl: `https://www.artsy.net/artwork/${n.slug}`,
        };
      });

    console.log(`[artsy] ✓ ${artworks.length} obras in ${Date.now() - t0}ms`);
    return artworks;
  } catch (err) {
    console.warn(`[artsy] Fetch failed:`, err instanceof Error ? err.message : err);
    return null;
  }
}
