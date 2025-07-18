import { Suspense } from "react";
import { Timeline } from "@/components/Timeline";
import {
  loadTimelineData,
  groupTimelineByYearMonth,
} from "@/utils/timelineData";

export default function Home() {
  const timelineData = loadTimelineData();
  const groupedTimeline = groupTimelineByYearMonth(timelineData.timeline);

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Timeline timelineData={groupedTimeline} />
      </Suspense>
    </main>
  );
}
