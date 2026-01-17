"use client";

import { useEffect, useMemo, useState } from "react";
import { useInfiniteBooks } from "@/hooks/useInfiniteBooks";
import { BookGrid } from "@/components/BookGrid";
import { SearchHeader } from "@/components/SearchHeader";
import { BackToTop } from "@/components/BackToTop";
import { SortDropdown, type SortOption } from "@/components/SortDropdown";
import type { Book } from "@/lib/openLibrary";

export default function LibraryPage() {
  const [query, setQuery] = useState("science");
  const [sort, setSort] = useState<SortOption>("relevance");

  // ✅ restore query from URL on first load
  useEffect(() => {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("q");
    if (q && q.trim()) setQuery(q.trim());
  }, []);

  // ✅ update URL when query changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    window.history.replaceState({}, "", url.toString());
  }, [query]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteBooks(query);

  const books = data?.pages.flatMap((page) => page.docs) ?? [];

  // ✅ client-side sorting (current loaded data only)
  const sortedBooks = useMemo(() => {
    if (sort === "relevance") return books;

    const copy = [...books];
    copy.sort((a: Book, b: Book) => {
      const ay = a.first_publish_year ?? 0;
      const by = b.first_publish_year ?? 0;
      return sort === "year_asc" ? ay - by : by - ay;
    });
    return copy;
  }, [books, sort]);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SearchHeader
        currentQuery={query}
        onSearchChange={(newQuery) => {
          const q = newQuery.trim() || "science";
          if (q !== query) window.scrollTo({ top: 0, behavior: "smooth" });
          setQuery(q);
        }}
      />

      <div className="container px-10 flex-1 py-6">
        {/* ✅ Sort bar */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{sortedBooks.length}</span>{" "}
            books for <span className="font-medium text-foreground">“{query}”</span>
          </p>

          <SortDropdown value={sort} onChange={setSort} />
        </div>

        {error ? (
          <div className="flex h-60 items-center justify-center text-destructive">
            Error loading books. Please try again.
          </div>
        ) : (
          <BookGrid
            books={sortedBooks}
            isLoading={isLoading}
            fetchNextPage={fetchNextPage}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </div>

      {/* ✅ Back to Top floating button */}
      <BackToTop />
    </main>
  );
}
