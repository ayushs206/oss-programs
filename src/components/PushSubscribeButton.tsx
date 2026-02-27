"use client";

import { useState, useEffect } from "react";
import { registerPush } from "@/lib/pushClient";

export function PushSubscribeButton() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [permission, setPermission] = useState<NotificationPermission | "loading">("loading");

    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            setPermission(Notification.permission);
        } else {
            setPermission("denied");
        }
    }, []);

    if (permission === "loading") {
        return null;
    }

    const handleSubscribe = async () => {
        setLoading(true);
        setError("");

        try {
            await registerPush();
        } catch (err) {
            console.error("Subscription failed:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            if (typeof window !== "undefined" && "Notification" in window) {
                setPermission(Notification.permission);
            }
            setLoading(false);
        }
    };

    if (permission === "granted") {
        return (
            <div className="pt-2">
                <p className="text-xs font-medium text-muted-foreground tracking-wide">
                    ✓ Notifications enabled
                </p>
            </div>
        );
    }

    if (permission === "denied") {
        return (
            <div className="pt-2">
                <p className="text-xs font-medium text-muted-foreground tracking-wide">
                    Notifications blocked — enable in browser settings
                </p>
            </div>
        );
    }

    return (
        <div className="pt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
                Get notified when new programs are added.
            </p>
            <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-fit px-5 py-2 text-sm font-medium rounded-full border border-border text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-200"
            >
                {loading ? "Enabling…" : "Enable Notifications"}
            </button>
            {error && (
                <p className="text-xs text-destructive font-medium">{error}</p>
            )}
        </div>
    );
}
