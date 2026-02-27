const BOOKMARK_KEY = "oss-bookmarks";

export function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(BOOKMARK_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function isBookmarked(slug: string): boolean {
  return getBookmarks().includes(slug);
}

export function toggleBookmark(slug: string): boolean {
  const bookmarks = getBookmarks();

  let updated;
  if (bookmarks.includes(slug)) {
    updated = bookmarks.filter((s) => s !== slug);
  } else {
    updated = [...bookmarks, slug];
  }

  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));

  // notify all components
  window.dispatchEvent(new Event("bookmarkUpdated"));

  return updated.includes(slug);
}