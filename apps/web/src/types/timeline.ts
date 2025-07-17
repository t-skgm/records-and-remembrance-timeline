export interface TimelineEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  title: string;
  description: string;
  projectCategory: string;
  eventType: "release" | "live" | "collaboration" | "other";
  articlePath?: string; // 追加: 記事へのパス（オプション）
  media?: {
    type: "image" | "youtube" | "none";
    url: string;
    caption?: string;
  };
}

export interface TimelineData {
  timeline: TimelineEntry[];
}

export interface GroupedTimeline {
  [year: string]: {
    [month: string]: TimelineEntry[];
  };
}
