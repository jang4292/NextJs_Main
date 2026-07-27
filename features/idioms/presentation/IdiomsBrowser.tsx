import { IdiomCard } from "@/features/idioms/components/IdiomCard";
import { idioms } from "@/features/idioms/data/idioms";

export function IdiomsBrowser() {
  return (
    <section aria-label="사자성어 목록">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {idioms.map((idiom) => (
          <IdiomCard key={idiom.id} idiom={idiom} />
        ))}
      </div>
    </section>
  );
}
