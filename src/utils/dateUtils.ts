
export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}