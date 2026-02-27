"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { ComputedProgram } from "@/lib/programs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgramCard } from "./ProgramCard";
import { Search } from "lucide-react";

interface ProgramListProps {
  programs: ComputedProgram[];
  showControls?: boolean;
}

export function ProgramList({ programs, showControls = true }: ProgramListProps) {
  const [query, setQuery] = useState("");

  const [workMode, setWorkMode] = useState<"all" | "remote" | "onsite">("all");
  const [compensation, setCompensation] = useState<"all" | "paid" | "unpaid">("all");
  const [eligibility, setEligibility] = useState<"all" | "students" | "professionals">("all");

  const baseFilteredPrograms = useMemo(() => {
    let result = programs;

    // Work mode filter
    if (workMode !== "all") {
      result = result.filter((program) =>
        workMode === "remote"
          ? program.remote === true
          : program.remote === false
      );
    }

    // Compensation filter
    if (compensation !== "all") {
      result = result.filter((program) =>
        compensation === "paid"
          ? program.stipend.available === true
          : program.stipend.available === false
      );
    }

    // Eligibility filter
    if (eligibility !== "all") {
      result = result.filter((program) => {
        if (program.eligibility.type === "open") return true;

        return eligibility === "students"
          ? program.eligibility.type === "students"
          : program.eligibility.type === "professionals";
      });
    }

    return result;
  }, [programs, workMode, compensation, eligibility]);

  // Decouple Indexing: Re-index only when filters or the underlying data changes, not on every keystroke.
  const fuseIndex = useMemo(() => {
    return new Fuse(baseFilteredPrograms, {
      keys: ["name", "description", "category", "tags", "slug"],
      threshold: 0.3,
      includeMatches: true,
    });
  }, [baseFilteredPrograms]);

  const searchResults = useMemo(() => {
    // Agar koi search query nahi hai, toh default order (by status) dikhao
    if (!query.trim()) {
      const statusOrder: Record<string, number> = { open: 0, opening_soon: 1, upcoming: 2, closed: 3 };
      return [...baseFilteredPrograms]
        .sort((a, b) => (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99))
        .map(item => ({ item, matches: undefined }));
    }

    // Execute search against the cached index
    return fuseIndex.search(query);
  }, [baseFilteredPrograms, fuseIndex, query]);

  const handleClear = () => {
    setQuery("");
    setWorkMode("all");
    setCompensation("all");
    setEligibility("all");
  };

  return (
    <div className="space-y-12">

      {/* Search */}
      {showControls && (
        <div className="relative w-full md:max-w-xl mx-auto md:mx-0 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Search programs, tags, or categories…"
            className="pl-12 h-12 md:h-14 text-base md:text-lg rounded-xl md:rounded-2xl border bg-card/50 glass focus-visible:ring-primary/20 transition-all focus-within:scale-[1.01]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {/* Filters */}
      {showControls && (
        <div className="space-y-6">

          {/* Work Mode */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Work Mode:
            </span>

            <Button size="sm" variant={workMode === "all" ? "default" : "outline"} onClick={() => setWorkMode("all")}>All</Button>
            <Button size="sm" variant={workMode === "remote" ? "default" : "outline"} onClick={() => setWorkMode("remote")}>Remote</Button>
            <Button size="sm" variant={workMode === "onsite" ? "default" : "outline"} onClick={() => setWorkMode("onsite")}>On-site</Button>
          </div>

          {/* Compensation */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Compensation:
            </span>

            <Button size="sm" variant={compensation === "all" ? "default" : "outline"} onClick={() => setCompensation("all")}>All</Button>
            <Button size="sm" variant={compensation === "paid" ? "default" : "outline"} onClick={() => setCompensation("paid")}>Paid</Button>
            <Button size="sm" variant={compensation === "unpaid" ? "default" : "outline"} onClick={() => setCompensation("unpaid")}>Unpaid</Button>
          </div>

          {/* Eligibility */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Eligibility:
            </span>

            <Button size="sm" variant={eligibility === "all" ? "default" : "outline"} onClick={() => setEligibility("all")}>All</Button>
            <Button size="sm" variant={eligibility === "students" ? "default" : "outline"} onClick={() => setEligibility("students")}>Students</Button>
            <Button size="sm" variant={eligibility === "professionals" ? "default" : "outline"} onClick={() => setEligibility("professionals")}>Professionals</Button>
          </div>

        </div>
      )}

      {/* Empty State */}
      {searchResults.length === 0 ? (
        <div className="py-24 text-center space-y-4 glass rounded-3xl border-dashed">
          <p className="text-xl font-medium text-muted-foreground">
            {showControls && query.trim()
              ? `No opportunities found matching "${query}"`
              : showControls
                ? "No opportunities found."
                : "You haven't bookmarked any opportunities yet."}
          </p>

          {showControls && (
            <button
              onClick={handleClear}
              className="text-primary font-semibold hover:underline"
            >
              Clear filters and show all
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {searchResults.map(({ item, matches }, index) => (
            <ProgramCard key={item.slug} program={item} index={index} matches={matches} />
          ))}
        </div>
      )}

    </div>
  );
}