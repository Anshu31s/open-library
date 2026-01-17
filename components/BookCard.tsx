import { Book, getCoverUrl } from "@/lib/openLibrary";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const coverUrl = book.cover_i ? getCoverUrl(book.cover_i, "L") : "";

  const subjects = book.subject?.slice(0, 3) || [];

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        {book.cover_i ? (
          <Image
            src={coverUrl}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 text-center">
            <span className="text-4xl">📚</span>
            <span className="mt-2 text-xs text-muted-foreground">No Cover</span>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        <h3 className="font-bold leading-tight line-clamp-2" title={book.title}>
          {book.title}
        </h3>

        <div className="text-sm text-muted-foreground">
          <p className="line-clamp-1">
            {book.author_name?.slice(0, 2).join(", ") || "Unknown Author"}
          </p>
          <p className="text-xs mt-1">{book.first_publish_year || "N/A"}</p>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 flex flex-wrap gap-1">
        {subjects.map((subject, idx) => (
          <Badge
            key={`${subject}-${idx}`}
            variant="secondary"
            className="text-[10px] px-1.5 h-5"
          >
            {subject}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}
