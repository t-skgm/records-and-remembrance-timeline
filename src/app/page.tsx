import { Timeline } from "@/components/Timeline";
import { getDeployDate } from "@/utils/helpers";
import {
  loadTimelineData,
  groupTimelineByYearMonth,
} from "@/utils/timelineData";

export default function Home() {
  const timelineData = loadTimelineData();
  const groupedTimeline = groupTimelineByYearMonth(timelineData.timeline);
  const deployDate = getDeployDate();

  return (
    <main>
      <Timeline timelineData={groupedTimeline} deployDate={deployDate} />
    </main>
  );
}
