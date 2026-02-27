"use client";

import { useEffect, useState } from "react";
import { getBookmarks } from "@/lib/bookmarks";
import { ProgramList } from "@/components/ProgramList";
import { ComputedProgram } from "@/lib/programs";

interface Props {
  programs: ComputedProgram[];
}

export default function BookmarksClient({ programs }: Props) {
  const [filtered, setFiltered] = useState<ComputedProgram[]>([]);

  useEffect(() => {
    const update = () => {
      const bookmarkedSlugs = getBookmarks();

      const result = programs.filter((program) =>
        bookmarkedSlugs.includes(program.slug)
      );

      setFiltered(result);
    };

    update();
    window.addEventListener("bookmarkUpdated", update);

    return () =>
      window.removeEventListener("bookmarkUpdated", update);
  }, [programs]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Bookmarks
        </h1>

        <a
          href="/programs"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          See all programs →
        </a>
      </div>

      <div className="mt-4 h-px bg-border" />

      {/* Content */}
      <div className="mt-8">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground">
            You haven’t bookmarked any programs yet.
          </p>
        ) : (
          <ProgramList programs={filtered} showControls={false} />
        )}
      </div>
    </div>
  );
}