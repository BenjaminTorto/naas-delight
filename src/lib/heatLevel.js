// Naa's Delight doesn't currently store a spice/heat rating in the Supabase
// `menu` table, so this infers a 0-3 heat level from each dish's own name
// and description (mentions of "spicy", "scotch bonnet", "pepper"/"chilli").
// If a real `heat_level` column is ever added to the table, that value is
// used instead — this is only a fallback based on the copy already there.
export function getHeatLevel(item) {
  if (typeof item.heat_level === 'number') return item.heat_level;

  const text = `${item.name || ''} ${item.description || ''}`.toLowerCase();

  if (/\bspicy\b/.test(text)) return 3;
  if (/scotch bonnet/.test(text)) return 2;
  if (/\b(pepper|chilli|chili)\b/.test(text)) return 1;
  return 0;
}
