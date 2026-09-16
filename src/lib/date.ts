export function getWeekdayName(dateString: string) {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
    }).format(new Date(`${dateString}T00:00:00`));
}