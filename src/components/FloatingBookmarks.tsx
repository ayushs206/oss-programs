"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { getBookmarks } from "@/lib/bookmarks";
import { useRouter } from "next/navigation";

export function FloatingBookmarks() {
    const [count, setCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const update = () => {
            setCount(getBookmarks().length);
        };

        update(); // initial load

        window.addEventListener("bookmarkUpdated", update);

        return () =>
            window.removeEventListener("bookmarkUpdated", update);
    }, []);

    if (count === 0) return null;
    return (
        <button
            onClick={() => router.push("/bookmarks")}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full shadow-lg transition-all duration-200 active:scale-95 hover:scale-105 bg-black text-white dark:bg-white dark:text-black px-4 py-3"
        >
            <Bookmark className="w-5 h-5" />
            <span className="font-semibold text-sm">{count}</span>
        </button>
    );
}