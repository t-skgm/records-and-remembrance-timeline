import { TimelineData, TimelineEntry, GroupedTimeline } from "@/types/timeline";
import * as timelineData from "../data/timeline.json";

export function loadTimelineData(): TimelineData {
  return timelineData as TimelineData;
}

export function groupTimelineByYearMonth(
  entries: TimelineEntry[],
): GroupedTimeline {
  const grouped: GroupedTimeline = {};

  entries.forEach((entry) => {
    const date = new Date(entry.date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();

    if (!grouped[year]) {
      grouped[year] = {};
    }

    if (!grouped[year][month]) {
      grouped[year][month] = [];
    }

    grouped[year][month].push(entry);
  });

  return grouped;
}

export function formatMonthName(month: string): string {
  const monthNumber = parseInt(month, 10);
  const monthNames = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];
  return monthNames[monthNumber - 1] || month;
}

export function formatYearName(year: string): string {
  // Convert 2024 to 二〇二四年
  const digits = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  return (
    year
      .split("")
      .map((digit) => digits[parseInt(digit)])
      .join("") + "年"
  );
}

export function getYouTubeEmbedUrl(url: string): string {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
  );
  if (videoIdMatch) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  return url;
}
