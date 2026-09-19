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
