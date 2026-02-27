"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
    slug: string;
    size?: "sm" | "md" | "lg";
}

export function BookmarkButton({ slug, size = "md" }: BookmarkButtonProps) {
    const [bookmarked, setBookmarked] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setBookmarked(isBookmarked(slug));

        const update = () => setBookmarked(isBookmarked(slug));
        window.addEventListener("bookmarkUpdated", update);

        return () =>
            window.removeEventListener("bookmarkUpdated", update);
    }, [slug]);

    if (!mounted) return null; // avoid hydration mismatch

    const sizes = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setBookmarked(toggleBookmark(slug));
            }}
            className={cn(
                "flex items-center justify-center rounded-full transition-all duration-200",
                "w-9 h-9", // circle size
                bookmarked
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-muted hover:bg-muted/70 text-muted-foreground"
            )}
        >
            <Bookmark
                className={cn(
                    "w-4 h-4 transition-all duration-200",
                    bookmarked && "fill-current"
                )}
            />
        </button>
    );
}