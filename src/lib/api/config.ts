export function getApiBaseUrl(): string {
    if (typeof window !== "undefined" && window.location.hostname === "127.0.0.1") {
        return "http://127.0.0.1:8080";
    }

    return "http://localhost:8080";
}