"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Search, X, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility, typical in shadcn

interface SearchHeaderProps {
  currentQuery: string;
  onSearchChange: (query: string) => void;
}

const QUICK_FILTERS = [
  "Science",
  "Mathematics",
  "History",
  "Biology",
  "Astronomy",
  "Fiction",
  "Technology",
];

export function SearchHeader({ currentQuery, onSearchChange }: SearchHeaderProps) {
  const [inputValue, setInputValue] = useState(currentQuery);
  const { setTheme, theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  // Sync internal state with prop
  useEffect(() => {
    setInputValue(currentQuery);
  }, [currentQuery]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      const q = inputValue.trim();
      onSearchChange(q);
    }, 400);
    return () => clearTimeout(t);
  }, [inputValue, onSearchChange]);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm border-border/40"
          : "bg-background border-transparent"
      )}
    >
      <div className="container mx-auto px-4 py-3 md:py-4 max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          
          {/* Top Row: Brand & Toggles */}
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-2.5 select-none group cursor-pointer">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  Edzy<span className="text-primary">.Lib</span>
                </span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Explore Books
                </span>
              </div>
            </div>

            {/* Mobile Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-muted"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 w-full md:max-w-xl md:px-8">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for books, authors, or ISBNs..."
                className="h-11 w-full rounded-2xl border-muted bg-muted/40 pl-10 pr-10 text-sm shadow-sm transition-all placeholder:text-muted-foreground/60 hover:bg-muted/60 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50"
              />
              {inputValue.trim().length > 0 && (
                <button
                  onClick={() => setInputValue("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-muted-foreground hover:bg-foreground/10 hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Theme Toggle */}
          <div className="hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-muted"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>

        {/* Bottom Row: Quick Filters */}
        <div className="mt-3 relative">
            {/* Gradient Fade Masks for scrolling indication */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-background to-transparent z-10 md:hidden" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />

            <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar px-1 scroll-smooth">
            {QUICK_FILTERS.map((filter) => {
                const isActive = currentQuery.toLowerCase() === filter.toLowerCase();
                return (
                <button 
                    key={filter} 
                    onClick={() => setInputValue(filter)}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full"
                >
                    <Badge
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                        "rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap",
                        isActive 
                        ? "shadow-md shadow-primary/25 border-primary" 
                        : "bg-background hover:bg-muted border-muted-foreground/20 text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"
                    )}
                    >
                    {filter}
                    </Badge>
                </button>
                );
            })}
            </div>
        </div>
      </div>
    </header>
  );
}