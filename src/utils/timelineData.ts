import {
  TimelineData,
  TimelineEntry,
  GroupedTimeline,
  EventType,
} from "@/types/timeline";
import { timelineEntries } from "../data/timeline";

export function loadTimelineData(): TimelineData {
  return { timeline: timelineEntries };
}

export const eventTypeDisplayNames: { [key in EventType]: string } = {
  live: "ライブ",
  release: "リリース",
  activity: "活動",
  member: "メンバー",
  media: "メディア",
  other: "その他",
};

// フィルター用のユニークな値を取得する関数
export function getUniqueEventTypes(entries: TimelineEntry[]): EventType[] {
  const eventTypes = entries.map((entry) => entry.eventType);
  return Array.from(new Set(eventTypes)).sort();
}

export function getUniqueProjectCategories(entries: TimelineEntry[]): string[] {
  const categories = entries.map((entry) => entry.projectCategory);
  return Array.from(new Set(categories))
    .filter((x) => x != null)
    .sort();
}

// フィルター条件を適用する関数
export function filterTimelineEntries(
  entries: TimelineEntry[],
  filters: {
    eventTypes?: EventType[];
    projectCategories?: string[];
  }
): TimelineEntry[] {
  return entries.filter((entry) => {
    const eventTypeMatch =
      !filters.eventTypes?.length ||
      filters.eventTypes.includes(entry.eventType);

    const categoryMatch =
      !filters.projectCategories?.length ||
      filters.projectCategories.includes(entry.projectCategory ?? "");

    return eventTypeMatch && categoryMatch;
  });
}

export function groupTimelineByYearMonth(
  entries: TimelineEntry[]
): GroupedTimeline {
  const grouped = entries.reduce<GroupedTimeline>((acc, entry) => {
    const date = new Date(entry.date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();

    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][month]) {
      acc[year][month] = [];
    }
    acc[year][month].push(entry);

    return acc;
  }, {});

  return grouped;
}
