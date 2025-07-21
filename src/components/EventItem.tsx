import { TimelineEntry } from "@/domain/timeline";
import { clsx } from "clsx";
import { MediaEmbed } from "./MediaEmbed";
import Link from "next/link";
import { eventTypeDisplayNames } from "@/utils/timelineData";
import { parseNumber } from "@/utils/parseNumber";

interface EventItemProps {
  event: TimelineEntry;
}

const formatDate = (dateString: string) => {
  // タイムゾーンの影響を避けるため、直接パースする
  const [, , day] = dateString.split("-");
  return `${parseNumber(day)}日`;
};

export function EventItem({ event }: EventItemProps) {
  // タイトル部分を条件付きでリンク化
  const renderTitle = () => {
    const titleElement = (
      <h3
        className={clsx(
          "event-title text-base font-medium mb-1 leading-snug",
          event.articlePath
            ? "text-timeline-accent hover:underline cursor-pointer transition-colors"
            : "text-timeline-text-primary"
        )}
      >
        {event.title}
      </h3>
    );

    if (event.articlePath) {
      return (
        <Link href={event.articlePath} className="block">
          {titleElement}
        </Link>
      );
    }

    return titleElement;
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
        <time
          className="event-date text-sm text-timeline-text-secondary font-semibold min-w-12 text-left pr-2 border-r border-gray-200"
          data-day-only={formatDate(event.date)}
        >
          {formatDate(event.date)}
        </time>

        <div className="event-meta flex flex-wrap gap-2 pl-2">
          {event.projectCategory ? (
            <span
              className={clsx(
                "px-2 py-0.5 text-xs font-medium rounded-full border",
                "bg-timeline-accent-light text-timeline-accent border-timeline-accent/30"
              )}
            >
              {event.projectCategory}
            </span>
          ) : null}
          <span
            className={clsx(
              "px-2 py-0.5 text-xs font-medium rounded-full border",
              "bg-gray-100 text-gray-700 border-gray-300"
            )}
          >
            {eventTypeDisplayNames[event.eventType] || event.eventType}
          </span>
        </div>
      </div>

      {renderTitle()}

      {/*
      <div className="event-description text-sm text-timeline-text-secondary mb-2">
        {event.description}
      </div>
      */}

      {event.media && <MediaEmbed media={event.media} title={event.title} />}
    </div>
  );
}
