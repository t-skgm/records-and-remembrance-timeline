import { GroupedTimeline } from "@/types/timeline";
import { YearSection } from "./YearSection";
import { ScrollTracker } from "./ScrollTracker";

interface TimelineProps {
  timelineData: GroupedTimeline;
  deployDate?: string;
}

export function Timeline({ timelineData, deployDate }: TimelineProps) {
  // Sort years in chronological order
  const sortedYears = Object.keys(timelineData).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  return (
    <ScrollTracker>
      <div className="pt-8" />

      <div className="bg-timeline-bg text-timeline-text-primary mb-26">
        <h1 className="text-5xl font-bold text-timeline-text-secondary">
          Records and remembrance: Timeline
        </h1>
        <p className="text-lg text-timeline-text-secondary mt-4 italic">
          Explore the timeline of significant events and milestones of MONDEN
          Masaaki
        </p>
        {deployDate && (
          <p className="text-sm text-timeline-text-secondary mt-2 opacity-75">
            最終更新日: {deployDate}
          </p>
        )}
      </div>

      {sortedYears.map((year) => (
        <YearSection key={year} year={year} monthsData={timelineData[year]} />
      ))}
    </ScrollTracker>
  );
}
