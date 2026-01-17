"use client";

import { useEffect, useMemo, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useInView } from "react-intersection-observer";
import { Book } from "@/lib/openLibrary";
import { BookCard } from "./BookCard";

interface BookGridProps {
  books: Book[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function BookGrid({
  books,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: BookGridProps) {
  // ✅ Responsive columns based on screen size
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;

      if (width >= 1536)
        setColumns(6); // 2xl
      else if (width >= 1280)
        setColumns(5); // xl
      else if (width >= 1024)
        setColumns(4); // lg
      else if (width >= 768)
        setColumns(3); // md
      else setColumns(2); // sm
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // ✅ Convert books list into "rows" (each row has N books)
  const rows = useMemo(() => {
    const result: Book[][] = [];
    for (let i = 0; i < books.length; i += columns) {
      result.push(books.slice(i, i + columns));
    }
    return result;
  }, [books, columns]);

  // ✅ Virtualize ROWS (window scroll)
  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 520, // initial guess (real height will be measured)
    overscan: 6,
  });

  // ✅ Infinite scroll sentinel
  const { ref: sentinelRef, inView } = useInView({
    rootMargin: "700px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ✅ Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-[420px] bg-muted/30 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center p-10 text-muted-foreground">
        No books found.
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* This creates the full scroll height */}
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowBooks = rows[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              ref={rowVirtualizer.measureElement}
              data-index={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="px-4 py-4" // ✅ spacing between rows
            >
              <div
                className="grid gap-4 w-full"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
              >
                {rowBooks.map((book) => (
                  <BookCard key={book.key} book={book} />
                ))}
              </div>

              {/* ✅ Sentinel near last row to load more */}
              {virtualRow.index === rows.length - 1 && (
                <div
                  ref={sentinelRef}
                  className="h-16 w-full flex justify-center items-center mt-6"
                >
                  {isFetchingNextPage ? (
                    <span className="text-sm text-muted-foreground">
                      Loading more...
                    </span>
                  ) : !hasNextPage ? (
                    <span className="text-sm text-muted-foreground">
                      You reached the end ✅
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
