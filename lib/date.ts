// lib/date.ts
import { format } from "date-fns";

export function formatPublishYear(year?: number) {
  if (!year) return "N/A";

  // OpenLibrary gives only a year number, so we create a valid Date
  const d = new Date(year, 0, 1); // Jan 1st of that year
  return format(d, "yyyy");
}
