export function getCurrentMonthRange() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    dateFrom: `${values.year}-${values.month}-01`,
    dateTo: `${values.year}-${values.month}-${values.day}`,
  };
}
