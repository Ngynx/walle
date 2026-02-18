// ─── Helpers ──────────────────────────────────────────────────────────────────
export function toDateStr(date: Date): string {
    return date.toISOString().slice(0, 10).replace(/-/g, '_'); // "2026_02_17"
}

export function startOfDayMs(date: Date): number {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d.getTime();
}