import { idioms } from "@/features/idioms/data/idioms";

export function getIdiomBySlug(slug: string) {
  return idioms.find((idiom) => idiom.slug === slug);
}
