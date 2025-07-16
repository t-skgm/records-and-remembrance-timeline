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
    <div
      className="month-section"
      style={{
        display: "block",
        width: "100%",
        marginBottom: "2rem",
        paddingLeft: "2rem",
        position: "relative",
      }}
    >
      <h3
        id={`month-${year}-${month}`}
        className="month-title"
        style={{
          fontSize: "1.2rem",
          fontWeight: 500,
          color: "#555",
          marginBottom: "1rem",
          letterSpacing: "0.05em",
        }}
      >
        {month}月
      </h3>

      <div
        className="events-container"
        style={{
          paddingLeft: "1rem",
        }}
      >
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
