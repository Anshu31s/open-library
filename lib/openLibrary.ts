export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
}

export interface SearchResponse {
  docs: Book[];
  numFound: number;
  start: number;
}

const API_BASE = "https://openlibrary.org/search.json";

export async function fetchBooks(query: string, page: number): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q: query.trim(),
    page: String(page),
    fields: "key,title,author_name,first_publish_year,cover_i,subject",
  });

  const res = await fetch(`${API_BASE}?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  const data: SearchResponse = await res.json();

  //  guarantee max 20 per page (OpenLibrary may return more)
  return {
    ...data,
    docs: data.docs.slice(0, 20),
  };
}

export function getCoverUrl(
  coverId?: number,
  size: "L" | "M" | "S" = "L"
): string {
  if (!coverId) return "";
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}
