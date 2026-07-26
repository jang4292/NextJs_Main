import { idioms } from "@/features/idiom/data/idioms";

export function getIdiomBySlug(slug: string) {
  return idioms.find((idiom) => idiom.slug === slug);
}
