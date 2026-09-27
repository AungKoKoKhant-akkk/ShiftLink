export function getApiBaseUrl(): string {
    if (typeof window !== "undefined") {
        const host = window.location.hostname;
        if (host === "localhost" || host === "127.0.0.1") {
            return "http://localhost:8080";
        }
    }

    return "";
}