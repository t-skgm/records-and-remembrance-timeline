import { GroupedTimeline } from "@/types/timeline";
import YearSection from "./YearSection";
import ScrollTracker from "./ScrollTracker";

interface TimelineProps {
  timelineData: GroupedTimeline;
}

export default function Timeline({ timelineData }: TimelineProps) {
  // Sort years in chronological order
  const sortedYears = Object.keys(timelineData).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  return (
    <ScrollTracker>
      <div className="pt-8" />

      {sortedYears.map((year) => (
        <YearSection key={year} year={year} monthsData={timelineData[year]} />
      ))}
    </ScrollTracker>
  );
}
