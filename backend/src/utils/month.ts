// Helpers for working with calendar months expressed as "YYYY-MM" strings.

// Returns the half-open UTC range [start, end) covering a "YYYY-MM" month.
export function monthRange(month: string): { start: Date; end: Date } {
  const [yearStr, monthStr] = month.split("-");
  const year  = Number(yearStr);
  const mon    = Number(monthStr); // 1-12
  const start = new Date(Date.UTC(year, mon - 1, 1));
  const end   = new Date(Date.UTC(year, mon, 1)); // first day of next month
  return { start, end };
}

// The current month as "YYYY-MM" (UTC).
export function currentMonth(): string {
  const now = new Date();
  const mm  = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${now.getUTCFullYear()}-${mm}`;
}
