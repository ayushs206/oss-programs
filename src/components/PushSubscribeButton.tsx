"use client";

import { useState, useEffect } from "react";
import { registerPush } from "@/lib/pushClient";

export function PushSubscribeButton() {
    const [loading, setLoading] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission | "loading">("loading");

    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            setPermission(Notification.permission);
        } else {
            setPermission("denied");
        }
    }, []);

    if (permission !== "default") {
        return null;
    }

    const handleSubscribe = async () => {
        setLoading(true);

        try {
            await registerPush();
        } catch (error) {
            console.error("Subscription failed:", error);
        } finally {
            if (typeof window !== "undefined" && "Notification" in window) {
                setPermission(Notification.permission);
            }
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSubscribe}
            disabled={loading}
            className="px-4 py-2 mt-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
            {loading ? "Enabling..." : "Enable Notifications"}
        </button>
    );
}
