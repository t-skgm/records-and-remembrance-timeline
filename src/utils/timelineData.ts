import { TimelineData, TimelineEntry, GroupedTimeline } from "@/types/timeline";
import * as timelineData from "../data/timeline.json";

export function loadTimelineData(): TimelineData {
  return timelineData as TimelineData;
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
