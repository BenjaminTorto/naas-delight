// Naa's Delight is open Tue–Sun, 12PM–9PM London time, closed Mondays.
// This computes live status in Europe/London regardless of the visitor's
// own timezone, since that's where the kitchen actually operates.

const OPEN_HOUR = 12;   // 12:00 PM
const CLOSE_HOUR = 21;  // 9:00 PM
const CLOSED_WEEKDAY = 1; // Monday (0 = Sun, 1 = Mon, ... 6 = Sat)

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function getLondonParts(date) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/London',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const map = {};
  fmt.formatToParts(date).forEach((p) => { map[p.type] = p.value; });
  let hour = parseInt(map.hour, 10);
  if (hour === 24) hour = 0;
  return {
    weekday: WEEKDAY_MAP[map.weekday],
    hour,
    minute: parseInt(map.minute, 10),
  };
}

function formatHour12(hour24) {
  const period = hour24 >= 12 ? 'PM' : 'AM';
  let h = hour24 % 12;
  if (h === 0) h = 12;
  return `${h}${period}`;
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Fixed-format date label (not locale-dependent, avoids "Sept" vs "Sep"
// inconsistencies across browsers) — e.g. "Thu, 24 Sep".
export function formatDateLabel(date) {
  return `${WEEKDAY_SHORT[date.getDay()]}, ${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`;
}

export function getLondonNowMinutes(date = new Date()) {
  const { hour, minute } = getLondonParts(date);
  return hour * 60 + minute;
}

export function toISODateString(date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Min/max values for a native <input type="date">, as "YYYY-MM-DD" strings.
export function getSchedulableDateRange(daysAhead = 13) {
  const today = getLondonTodayDateOnly();
  const max = new Date(today);
  max.setDate(max.getDate() + daysAhead);
  return { min: toISODateString(today), max: toISODateString(max) };
}

// Parses a native date input's "YYYY-MM-DD" value into a local Date at
// midnight, safely (avoids the UTC-parsing pitfall of `new Date(str)`).
export function parseDateInputValue(value) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatTimeLabel(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

export const KITCHEN_OPEN_HOUR = OPEN_HOUR;
export const KITCHEN_CLOSE_HOUR = CLOSE_HOUR;
export const KITCHEN_CLOSED_WEEKDAY = CLOSED_WEEKDAY;
export const KITCHEN_WEEKDAY_SHORT = WEEKDAY_SHORT;
export { formatHour12 };

export function getKitchenStatus(date = new Date()) {
  const { weekday, hour, minute } = getLondonParts(date);
  const minutesNow = hour * 60 + minute;
  const openMinutes = OPEN_HOUR * 60;
  const closeMinutes = CLOSE_HOUR * 60;

  const isOpenDay = weekday !== CLOSED_WEEKDAY;
  const isWithinHours = minutesNow >= openMinutes && minutesNow < closeMinutes;

  if (isOpenDay && isWithinHours) {
    const remaining = closeMinutes - minutesNow;
    const h = Math.floor(remaining / 60);
    const m = remaining % 60;
    const label = h > 0
      ? (m > 0 ? `closes in ${h}h ${m}m` : `closes in ${h}h`)
      : `closes in ${m}m`;
    return { isOpen: true, label };
  }

  // Closed: today, before opening
  if (isOpenDay && minutesNow < openMinutes) {
    return { isOpen: false, label: `opens today ${formatHour12(OPEN_HOUR)}` };
  }

  // Closed: find the next open day
  let nextDay = weekday;
  do {
    nextDay = (nextDay + 1) % 7;
  } while (nextDay === CLOSED_WEEKDAY);

  return { isOpen: false, label: `opens ${WEEKDAY_SHORT[nextDay]} ${formatHour12(OPEN_HOUR)}` };
}

// Today's calendar date in London, as a local midnight Date object.
// Used only for comparing y/m/d — not for exact instants — so the
// browser's own timezone doesn't affect which "day" is considered today.
export function getLondonTodayDateOnly() {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const map = {};
  fmt.formatToParts(new Date()).forEach((p) => { map[p.type] = p.value; });
  return new Date(`${map.year}-${map.month}-${map.day}T00:00:00`);
}

export function isKitchenClosedOn(date) {
  return date.getDay() === CLOSED_WEEKDAY;
}

// Half-hour pickup/delivery slots for a given calendar date, expressed as
// London wall-clock time (e.g. "3:00 PM") — the same way a customer would
// say it out loud, with no timezone conversion needed since it's understood
// to mean the kitchen's own local time regardless of the visitor's device.
// A short lead time is enforced only when the date is today, so customers
// can't schedule a pickup time that's already passed or seconds away.
export function getAvailableSlotsForDate(date, { leadMinutes = 45 } = {}) {
  const today = getLondonTodayDateOnly();
  const isToday = date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate();

  let earliestMinutes = OPEN_HOUR * 60;
  if (isToday) {
    const { hour, minute } = getLondonParts(new Date());
    earliestMinutes = Math.max(earliestMinutes, hour * 60 + minute + leadMinutes);
  }

  const slots = [];
  for (let m = OPEN_HOUR * 60; m < CLOSE_HOUR * 60; m += 30) {
    if (m < earliestMinutes) continue;
    const h24 = Math.floor(m / 60);
    const mm = m % 60;
    const period = h24 >= 12 ? 'PM' : 'AM';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    slots.push(`${h12}:${mm.toString().padStart(2, '0')} ${period}`);
  }
  return slots;
}
