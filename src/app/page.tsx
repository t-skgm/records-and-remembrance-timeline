"use client";

import { Timeline } from "@/components/Timeline";
import { TimelineFilter } from "@/components/TimelineFilter";
import { getDeployDate } from "@/utils/helpers";
import { loadTimelineData } from "@/utils/timelineData";
import { useTimelineFilter } from "@/components/useTimelineFilter";

export default function Home() {
  const timelineData = loadTimelineData();
  const deployDate = getDeployDate();

  const {
    eventTypes,
    projectCategories,
    groupedTimeline,
    selectedEventTypes,
    selectedProjectCategories,
    setSelectedEventTypes,
    setSelectedProjectCategories,
    resetFilters,
  } = useTimelineFilter(timelineData.timeline);

  return (
    <main className="relative">
      {/* 浮動フィルター */}
      <TimelineFilter
        eventTypes={eventTypes}
        projectCategories={projectCategories}
        selectedEventTypes={selectedEventTypes}
        selectedProjectCategories={selectedProjectCategories}
        onEventTypesChange={setSelectedEventTypes}
        onProjectCategoriesChange={setSelectedProjectCategories}
        onReset={resetFilters}
      />

      <Timeline timelineData={groupedTimeline} deployDate={deployDate} />
    </main>
  );
}
