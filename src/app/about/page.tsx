import type { Metadata } from "next";

const ossRepoURL = process.env?.OSS_REPO_LINK || "https://github.com/OWASP-STUDENT-CHAPTER/oss-programs"

export const metadata: Metadata = {
    title: "About | OSS Opportunities",
    description:
        "Learn more about OSS Opportunities – a platform to discover open source grants, fellowships, internships, and hackathons in one place.",

    keywords: [
        "Open Source",
        "OSS Opportunities",
        "Open Source Programs",
        "Grants",
        "Fellowships",
        "Hackathons",
        "Internships",
    ],

    openGraph: {
        title: "About | OSS Opportunities",
        description:
            "Discover the mission behind OSS Opportunities and how we help students and developers find open source programs.",
        url: "/about",
        siteName: "OSS Opportunities",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "About | OSS Opportunities",
        description:
            "Learn more about OSS Opportunities and our mission to centralize open source programs.",
    },

    alternates: {
        canonical: "/about",
    },
};

export default function AboutPage() {
    return (
        <main className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen px-6 py-16 transition-colors">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl transition-colors">
                    <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded">
                        Platform Initiative
                    </span>

                    <h1 className="text-4xl font-bold mt-4 mb-2">
                        OSS Program Discovery Platform
                    </h1>

                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                        A centralized platform that enables users to discover open source
                        programs, submit new opportunities, and collaboratively enhance
                        the ecosystem through community-driven contributions.
                    </p>

                    <div className="mt-5 flex gap-3">
                        <a href="/programs"
                            className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition">
                            Browse Programs
                        </a>

                        <a href={ossRepoURL}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition">
                            Contribute to Platform
                        </a>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid md:grid-cols-3 gap-6">

                    {/* LEFT */}
                    <div className="md:col-span-2 space-y-8">

                        <section>
                            <h2 className="text-2xl font-semibold mb-2">Overview</h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                This platform is designed to aggregate and showcase
                                open source programs from various organizations,
                                allowing contributors to easily discover initiatives
                                aligned with their interests and skill sets.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-2">
                                What You Can Do Here
                            </h2>
                            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-1">
                                <li>Discover active OSS programs</li>
                                <li>Submit new program opportunities</li>
                                <li>Track platform updates</li>
                                <li>Improve the platform via contributions</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-2">
                                Why This Exists
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Open source opportunities are often scattered across
                                multiple platforms. This initiative aims to bring them
                                together into a unified discovery system.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-2">
                                Contribution Flow
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Users can submit new programs which are reviewed
                                and listed on the platform.
                            </p>
                        </section>

                    </div>

                    {/* RIGHT PANEL */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 rounded-xl space-y-4 transition-colors">

                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Maintained By</p>
                            <p>OWASP TIET Community</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">License</p>
                            <p>MIT</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                            <p className="text-green-600 dark:text-green-400">Active Development</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Category</p>
                            <p>OSS Discovery</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Last Updated</p>
                            <p>Feb 2026</p>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
}