export const detectLevel = (title?: string, description?: string): string => {
  const t = title?.toLowerCase() || "";
  const d = description?.toLowerCase() || "";

  const match = (text: string, regex: RegExp) => regex.test(text);

  if (match(t, /\b(junior|jr\.?)\b/)) return "junior";
  if (match(t, /\b(mid(dle)?)\b/)) return "middle";
  if (match(t, /\b(senior|sr\.?)\b/)) return "senior";
  if (match(t, /\b(lead|principal|staff)\b/)) return "lead";

  if (match(d, /\b(junior|entry|intern)\b/)) return "junior";
  if (match(d, /\b(mid(dle)?|intermediate)\b/)) return "middle";
  if (match(d, /\b(senior|expert)\b/)) return "senior";
  if (match(d, /\b(lead|principal|staff)\b/)) return "lead";

  return "unknown2";
};