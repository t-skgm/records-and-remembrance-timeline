import { TimelineEntry } from "@/types/timeline";
import EventItem from "./EventItem";

interface MonthSectionProps {
  year: string;
  month: string;
  events: TimelineEntry[];
}

export default function MonthSection({
  year,
  month,
  events,
}: MonthSectionProps) {
  return (
    <div className="month-section block w-full mb-8 pl-4 md:pl-8 relative">
      <h3
        id={`month-${year}-${month}`}
        className="month-title text-xl font-medium text-timeline-text-secondary mb-4 tracking-wider"
      >
        {month}月
      </h3>

      <div className="events-container pl-4">
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
