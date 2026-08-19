interface JapaneseVocabularySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function JapaneseVocabularySearch({
  value,
  onChange,
}: JapaneseVocabularySearchProps) {
  return (
    <div>
      <label
        htmlFor="japanese-vocabulary-search"
        className="block text-sm font-semibold text-neutral-950"
      >
        검색
      </label>
      <input
        id="japanese-vocabulary-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="한자, 히라가나, romaji, 한국어 뜻"
        aria-describedby="japanese-vocabulary-search-description"
        className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 transition-colors outline-none placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
      <p id="japanese-vocabulary-search-description" className="sr-only">
        한자, 히라가나, 로마자, 대표 뜻만 검색합니다.
      </p>
    </div>
  );
}
