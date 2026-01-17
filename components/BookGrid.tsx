"use client";

import { useEffect, useMemo, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Book } from "@/lib/openLibrary";
import { BookCard } from "./BookCard";
import { useInView } from "react-intersection-observer";

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
  //  Responsive columns
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1280) setColumns(5);
      else if (width >= 1024) setColumns(4);
      else if (width >= 768) setColumns(3);
      else setColumns(2);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  //  Convert flat list -> rows
  const rows = useMemo(() => {
    const result: Book[][] = [];
    for (let i = 0; i < books.length; i += columns) {
      result.push(books.slice(i, i + columns));
    }
    return result;
  }, [books, columns]);

  //  Virtualize rows (window scrolling)
  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 520, // just a starting guess
    overscan: 6,
  });

  //  Infinite scroll sentinel
  const { ref: sentinelRef, inView } = useInView({
    rootMargin: "600px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  //  Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-[420px] bg-muted/30 animate-pulse rounded-xl"
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
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
          width: "100%",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowBooks = rows[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              ref={rowVirtualizer.measureElement} 
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="px-4 py-3"
            >
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
              >
                {rowBooks.map((book) => (
                  <BookCard key={book.key} book={book} />
                ))}
              </div>

              {/*  Put sentinel near the last rows */}
              {virtualRow.index === rows.length - 1 ? (
                <div
                  ref={sentinelRef}
                  className="h-16 w-full flex items-center justify-center mt-6"
                >
                  {isFetchingNextPage ? (
                    <span className="text-sm text-muted-foreground">
                      Loading more...
                    </span>
                  ) : !hasNextPage ? (
                    <span className="text-sm text-muted-foreground">
                      You reached the end 
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
