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
        <div
          className="media-embed"
          style={{
            maxWidth: "480px",
            marginTop: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%", // 16:9 aspect ratio
              height: 0,
              overflow: "hidden",
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <iframe
              src={embedUrl}
              title={event.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </div>
          {event.media.caption && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "#666",
                marginTop: "0.5rem",
                lineHeight: 1.4,
              }}
            >
              {event.media.caption}
            </p>
          )}
        </div>
      );
    }

    if (event.media.type === "image") {
      return (
        <div
          className="media-embed"
          style={{
            maxWidth: "400px",
            marginTop: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.media.url}
            alt={event.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
              display: "block",
            }}
          />
          {event.media.caption && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "#666",
                marginTop: "0.5rem",
                lineHeight: 1.4,
              }}
            >
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
      className={`event-item ${event.eventType}`}
      style={{
        display: "block",
        marginBottom: "1.5rem",
        padding: "0.5rem 0",
        position: "relative",
        fontFamily: "'Noto Sans JP', sans-serif",
        lineHeight: 1.6,
        letterSpacing: "0.02em",
      }}
    >
      <div
        className="event-meta-wrapper"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0.6rem",
          marginBottom: "0.5rem",
        }}
      >
        <time
          className="event-date"
          style={{
            fontSize: "0.9rem",
            color: "#555",
            fontWeight: 600,
            minWidth: "3rem",
            textAlign: "left",
            paddingRight: "0.5rem",
            borderRight: "1px solid #eee",
          }}
        >
          {formatDate(event.date)}
        </time>

        <div
          className="event-meta"
          style={{
            fontSize: "0.75rem",
            color: "#999",
            paddingLeft: "0.5rem",
          }}
        >
          {event.projectCategory} [{formatEventType(event.eventType)}]
        </div>
      </div>

      <h3
        className="event-title"
        style={{
          fontSize: "1rem",
          fontWeight: 500,
          color: "#333",
          marginBottom: "0.3rem",
          lineHeight: 1.4,
        }}
      >
        {event.title}
      </h3>

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

      {renderMedia()}
    </div>
  );
}
