import { getPrograms } from "@/lib/programs";
import { ProgramList } from "@/components/ProgramList";
import BookmarksClient from "./BookmarksClient";

export default async function BookmarksPage() {
    const programs = await getPrograms(); // same source as /programs

    return <BookmarksClient programs={programs} />;
}