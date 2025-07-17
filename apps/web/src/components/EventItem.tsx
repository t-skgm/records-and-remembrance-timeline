import { TimelineEntry } from "@/types/timeline";
import { getYouTubeEmbedUrl } from "@/utils/timelineData";

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

  const renderMedia = () => {
    if (!event.media) return null;

    if (event.media.type === "youtube") {
      const embedUrl = getYouTubeEmbedUrl(event.media.url);
      return (
        <div className="media-embed max-w-[480px] mt-4 mb-2">
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg bg-gray-100">
            <iframe
              src={embedUrl}
              title={event.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-none"
            />
          </div>
          {event.media.caption && (
            <p className="text-xs text-timeline-text-muted mt-2 leading-relaxed">
              {event.media.caption}
            </p>
          )}
        </div>
      );
    }

    if (event.media.type === "image") {
      return (
        <div className="media-embed max-w-[400px] mt-4 mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.media.url}
            alt={event.title}
            loading="lazy"
            className="w-full h-auto rounded-lg bg-gray-100 block"
          />
          {event.media.caption && (
            <p className="text-xs text-timeline-text-muted mt-2 leading-relaxed">
              {event.media.caption}
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      id={`date-${event.date}`}
      className={`event-item ${event.eventType} block mb-6 py-2 relative font-sans leading-relaxed tracking-wide`}
    >
      <div className="event-meta-wrapper flex flex-row gap-2.5 mb-2">
        <time className="event-date text-sm text-timeline-text-secondary font-semibold min-w-12 text-left pr-2 border-r border-gray-200">
          {formatDate(event.date)}
        </time>

        <div className="event-meta text-xs text-gray-400 pl-2">
          {event.projectCategory} [{formatEventType(event.eventType)}]
        </div>
      </div>

      <h3 className="event-title text-base font-medium text-timeline-text-primary mb-1 leading-snug">
        {event.title}
      </h3>

      {/*
      <div
        className="event-description"
        style={{
          fontSize: "0.85rem",
          color: "#666",
          lineHeight: 1.5,
          marginBottom: "0.5rem",
        }}
      >
        {event.description}
      </div>
      */}

      {renderMedia()}
    </div>
  );
}
