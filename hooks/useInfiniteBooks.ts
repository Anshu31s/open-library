// hooks/useInfiniteBooks.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchBooks, type SearchResponse } from "@/lib/openLibrary";

export function useInfiniteBooks(query: string) {
  return useInfiniteQuery<SearchResponse, Error>({
    queryKey: ["books", query],
    initialPageParam: 1,

    queryFn: ({ pageParam }) => fetchBooks(query, pageParam as number),

    getNextPageParam: (lastPage, allPages) => {
      const loadedBooks = allPages.flatMap((p) => p.docs).length;
      return loadedBooks < lastPage.numFound ? allPages.length + 1 : undefined;
    },

    staleTime: 1000 * 60 * 5,
    enabled: query.trim().length > 0,
  });
}
