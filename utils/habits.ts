export type Habit = {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
};

export type CompletionMap = {
  [date: string]: string[]; // date (YYYY-MM-DD) -> array of habit IDs completed
};

export function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function getLast49Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 48; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

export const HABIT_ICONS = [
  "running",
  "book",
  "water",
  "leaf",
  "trophy",
  "brain",
  "heart",
  "coffee",
  "pen",
  "music",
  "tablet",
  "utensils",
  "moon",
  "sun",
  "motorcycle",
] as const;

export const HABIT_ICON_LABELS: Record<string, string> = {
  running: "Running",
  book: "Reading",
  water: "Water",
  leaf: "Nature",
  trophy: "Fitness",
  brain: "Learning",
  heart: "Health",
  coffee: "Coffee",
  pen: "Writing",
  music: "Music",
  tablet: "Medicine",
  utensils: "Cooking",
  moon: "Evening",
  sun: "Morning",
  motorcycle: "Cycling",
};

export const HABIT_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#FF8C42",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F1948A",
] as const;
