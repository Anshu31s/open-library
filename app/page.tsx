"use client";

import { useState } from "react";
import { useInfiniteBooks } from "@/hooks/useInfiniteBooks";
import { BookGrid } from "@/components/BookGrid";
import { SearchHeader } from "@/components/SearchHeader";

export default function LibraryPage() {
  const [query, setQuery] = useState("science");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteBooks(query);

  const books = data?.pages.flatMap((page) => page.docs) ?? [];

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SearchHeader
        currentQuery={query}
        onSearchChange={(newQuery) => {
          const q = newQuery.trim() || "science";

          // only scroll if query actually changes
          if (q !== query) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }

          setQuery(q);
        }}
      />

      <div className="container flex-1 py-6">
        {error ? (
          <div className="flex h-60 flex-col items-center justify-center text-destructive">
            <p>Error loading books. Please try again.</p>
            <p className="mt-2 text-xs opacity-80">{error.message}</p>
          </div>
        ) : (
          <BookGrid
            books={books}
            isLoading={isLoading}
            fetchNextPage={fetchNextPage}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </div>
    </main>
  );
}
