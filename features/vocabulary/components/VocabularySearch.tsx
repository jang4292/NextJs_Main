interface VocabularySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function VocabularySearch({ value, onChange }: VocabularySearchProps) {
  return (
    <div>
      <label
        htmlFor="vocabulary-search"
        className="block text-sm font-semibold text-gray-900"
      >
        검색
      </label>
      <input
        id="vocabulary-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="영어 단어 또는 대표 뜻"
        aria-describedby="vocabulary-search-description"
        className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <p id="vocabulary-search-description" className="sr-only">
        영어 단어와 대표 뜻만 검색합니다.
      </p>
    </div>
  );
}
