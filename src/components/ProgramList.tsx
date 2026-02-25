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
}

export function ProgramList({ programs }: ProgramListProps) {
    const [query, setQuery] = useState("");

const [workMode, setWorkMode] = useState<"all" | "remote" | "onsite">("all");
const [compensation, setCompensation] = useState<"all" | "paid" | "unpaid">("all");
const [eligibility, setEligibility] = useState<"all" | "students" | "professionals">("all");

  const filteredPrograms = useMemo(() => {
    let result = programs;

    // apply filters
    if (workMode !== "all") {
        result = result.filter((program) =>
            workMode === "remote"
                ? program.remote === true
                : program.remote === false
        );
    }

    if (compensation !== "all") {
        result = result.filter((program) =>
            compensation === "paid"
                ? program.stipend.available === true
                : program.stipend.available === false
        );
    }

   if (eligibility !== "all") {
    result = result.filter((program) => {
        if (program.eligibility.type === "open") return true;

        return eligibility === "students"
            ? program.eligibility.type === "students"
            : program.eligibility.type === "professionals";
    });
}
    // if no query gives filtered and sorted
    if (!query.trim()) {
        const statusOrder = { open: 0, opening_soon: 1, upcoming: 2, closed: 3 };
        return [...result].sort(
            (a, b) => statusOrder[a.status] - statusOrder[b.status]
        );
    }
    
    // Fuse search after filtering
    const fuse = new Fuse(result, {
        keys: ["name", "description", "category", "tags", "slug"],
        threshold: 0.3,
    });

    return fuse.search(query).map((res) => res.item);

}, [programs, query, workMode, compensation, eligibility]);

    return (
        <div className="space-y-12">
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

  <div className="space-y-6">

  {/* for workmode*/}
  <div className="flex flex-wrap items-center gap-3">
    <span className="text-sm font-medium text-muted-foreground">
      Work Mode:
    </span>

    <Button
      size="sm"
      variant={workMode === "all" ? "default" : "outline"}
      onClick={() => setWorkMode("all")}
    >
      All
    </Button>

    <Button
      size="sm"
      variant={workMode === "remote" ? "default" : "outline"}
      onClick={() => setWorkMode("remote")}
    >
      Remote
    </Button>

    <Button
      size="sm"
      variant={workMode === "onsite" ? "default" : "outline"}
      onClick={() => setWorkMode("onsite")}
    >
      On-site
    </Button>
  </div>

  {/*For compensation*/}
  <div className="flex flex-wrap items-center gap-3">
    <span className="text-sm font-medium text-muted-foreground">
      Compensation:
    </span>

    <Button
      size="sm"
      variant={compensation === "all" ? "default" : "outline"}
      onClick={() => setCompensation("all")}
    >
      All
    </Button>

    <Button
      size="sm"
      variant={compensation === "paid" ? "default" : "outline"}
      onClick={() => setCompensation("paid")}
    >
      Paid
    </Button>

    <Button
      size="sm"
      variant={compensation === "unpaid" ? "default" : "outline"}
      onClick={() => setCompensation("unpaid")}
    >
      Unpaid
    </Button>
  </div>
  {/*For eligibility*/}
  <div className="flex flex-wrap items-center gap-3">
    <span className="text-sm font-medium text-muted-foreground">
      Eligibility:
    </span>

    <Button
      size="sm"
      variant={eligibility === "all" ? "default" : "outline"}
      onClick={() => setEligibility("all")}
    >
      All
    </Button>

    <Button
      size="sm"
      variant={eligibility === "students" ? "default" : "outline"}
      onClick={() => setEligibility("students")}
    >
      Students
    </Button>

    <Button
      size="sm"
      variant={eligibility === "professionals" ? "default" : "outline"}
      onClick={() => setEligibility("professionals")}
    >
      Professionals
    </Button>
  </div>

</div>

            {filteredPrograms.length === 0 ? (
                <div className="py-24 text-center space-y-4 glass rounded-3xl border-dashed">
                    <p className="text-xl font-medium text-muted-foreground">No opportunities found matching &quot;{query}&quot;</p>
                    <button onClick={() => setQuery("")} className="text-primary font-semibold hover:underline">Clear search and show all</button>
                </div>
            ) : (
                <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPrograms.map((program, index) => (
                        <ProgramCard key={program.slug} program={program} index={index} />
                    ))}
                </div>
            )}

        </div>
    );
} 



