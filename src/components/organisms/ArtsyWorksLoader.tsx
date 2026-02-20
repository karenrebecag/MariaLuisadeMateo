import { getArtsyArtworks } from "@/src/lib/artsy";
import { AvailableWorks, type WorkItem } from "./AvailableWorks";

/**
 * Async Server Component that fetches Artsy artworks and passes them
 * to the client-side AvailableWorks component. Falls back to the
 * hardcoded works when the fetch fails.
 */
export async function ArtsyWorksLoader() {
  const artworks = await getArtsyArtworks();

  const works: WorkItem[] | undefined = artworks?.map((a) => ({
    src: a.src,
    alt: a.alt,
    slug: a.slug,
    medium: a.medium,
    dimensions: a.dimensions,
    price: a.price,
    artsyUrl: a.artsyUrl,
  }));

  return <AvailableWorks works={works} />;
}
