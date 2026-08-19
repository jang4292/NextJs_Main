interface ChineseVocabularySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ChineseVocabularySearch({
  value,
  onChange,
}: ChineseVocabularySearchProps) {
  return (
    <div>
      <label
        htmlFor="chinese-vocabulary-search"
        className="block text-sm font-semibold text-neutral-950"
      >
        검색
      </label>
      <input
        id="chinese-vocabulary-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="간체자, 병음, xue2xi2, 한국어 뜻"
        aria-describedby="chinese-vocabulary-search-description"
        className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 transition-colors outline-none placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
      <p id="chinese-vocabulary-search-description" className="sr-only">
        간체자, 성조 병음, 숫자 성조 병음, 대표 뜻만 검색합니다.
      </p>
    </div>
  );
}
