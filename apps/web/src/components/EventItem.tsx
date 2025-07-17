import { TimelineEntry } from "@/types/timeline";
import { clsx } from "clsx";
import MediaEmbed from "./MediaEmbed";

interface EventItemProps {
  event: TimelineEntry;
}

export default function EventItem({ event }: EventItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}日`;
  };

  const formatEventType = (eventType: string) => {
    const typeMap: { [key: string]: string } = {
      release: "リリース",
      live: "ライブ",
      collaboration: "コラボ",
      other: "その他",
    };
    return typeMap[eventType] || eventType;
  };

  return (
    <div
      id={`date-${event.date}`}
      className={clsx(
        "event-item block mb-6 py-2 relative font-sans leading-relaxed tracking-wide",
        event.eventType
      )}
    >
      <div className="event-meta-wrapper flex flex-row gap-2.5 mb-2">
        <time className="event-date text-sm text-timeline-text-secondary font-semibold min-w-12 text-left pr-2 border-r border-gray-200">
          {formatDate(event.date)}
        </time>

        <div className="event-meta flex flex-wrap gap-2 pl-2">
          <span
            className={clsx(
              "px-2 py-0.5 text-xs font-medium rounded-full border",
              "bg-timeline-accent-light text-timeline-accent border-timeline-accent/30"
            )}
          >
            {event.projectCategory}
          </span>
          <span
            className={clsx(
              "px-2 py-0.5 text-xs font-medium rounded-full border",
              "bg-gray-100 text-gray-700 border-gray-300"
            )}
          >
            {formatEventType(event.eventType)}
          </span>
        </div>
      </div>

      <h3 className="event-title text-base font-medium text-timeline-text-primary mb-1 leading-snug">
        {event.title}
      </h3>

      {/*
      <div className="event-description text-sm text-timeline-text-secondary mb-2">
        {event.description}
      </div>
      */}

      {event.media && <MediaEmbed media={event.media} title={event.title} />}
    </div>
  );
}
