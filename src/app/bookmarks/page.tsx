import { getPrograms } from "@/lib/programs";
import { ProgramList } from "@/components/ProgramList";
import BookmarksClient from "./BookmarksClient";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bookmarks | OSS Opportunities",
    description:
        "View your saved open source programs and opportunities in one place.",

    openGraph: {
        title: "Bookmarks | OSS Opportunities",
        description:
            "Access your bookmarked open source programs including grants, fellowships, and internships.",
        url: "https://oss.owasptiet.com/bookmarks",
        siteName: "OSS Opportunities",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Bookmarks | OSS Opportunities",
        description:
            "Quickly access your saved open source opportunities.",
    },

    robots: {
        index: false, // Recommended since bookmarks are user-specific
        follow: true,
    },

    alternates: {
        canonical: "https://oss.owasptiet.com/bookmarks",
    },
};

export default async function BookmarksPage() {
    const programs = await getPrograms(); // same source as /programs

    return <BookmarksClient programs={programs} />;
}