// Shared view helpers for profile + dashboard (single source so both pages
// map the same DTOs the same way). No mock imports here.

export const safePct = (num, den) =>
  den > 0 ? Math.round((num / den) * 100) : 0;

export const formatDob = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatMemberSince = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
};

export const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Full social URL → bare handle for the sidebar link builder.
export const handleOf = (url) => {
  if (!url || !/^https?:\/\//i.test(url)) return url || "";
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1].replace(/^@/, "") : url;
  } catch {
    return url;
  }
};

// Profile DTO → DashboardSidebar user shape.
export const toSidebarUser = (dto) => ({
  displayName: dto.displayName,
  userId: dto.handle || "",
  initials: dto.initials,
  avatar: dto.avatarUrl,
  bio: dto.bio,
  location: dto.location,
  dob: formatDob(dto.dateOfBirth),
  memberSince: formatMemberSince(dto.memberSince),
  targetCompanies: dto.targetCompanies || [],
  github: handleOf(dto.githubUrl),
  linkedin: handleOf(dto.linkedinUrl),
  xId: handleOf(dto.xUrl),
  leetcode: handleOf(dto.leetcodeUrl),
  website: dto.websiteUrl,
});

// API { days: [{ date, count }] } → Heatmap `weeks` ([{ date: Date, days[7] }]).
export function daysToWeeks(days, cols = 52) {
  const counts = new Map(days.map((d) => [d.date, d.count]));
  const level = (c) => (c <= 0 ? 0 : c === 1 ? 1 : c <= 3 ? 2 : c <= 6 ? 3 : 4);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - (cols * 7 - 1));
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); // back to Monday

  const key = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;

  const weeks = [];
  for (let w = 0; w < cols; w++) {
    const monday = new Date(start);
    monday.setDate(start.getDate() + w * 7);
    const levels = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      levels.push(day > today ? 0 : level(counts.get(key(day)) || 0));
    }
    weeks.push({ date: monday, days: levels });
  }
  return weeks;
}
