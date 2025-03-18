"use client";

export const getUserData = () => {
    try {
        if (typeof window === "undefined") {
            return null;
        }

        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch (e) {
        console.error("Error fetching user data:", e);
        return null;
    }
};
