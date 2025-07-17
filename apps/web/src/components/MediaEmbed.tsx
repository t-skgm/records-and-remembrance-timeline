import { TimelineEntry } from "@/types/timeline";
import { getYouTubeEmbedUrl } from "@/utils/timelineData";

interface MediaEmbedProps {
  media: NonNullable<TimelineEntry["media"]>;
  title: string;
}

export function MediaEmbed({ media, title }: MediaEmbedProps) {
  if (media.type === "youtube") {
    const embedUrl = getYouTubeEmbedUrl(media.url);
    return (
      <div className="media-embed max-w-[480px] mt-4 mb-2">
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg bg-gray-100">
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full border-none"
          />
        </div>
        {media.caption && (
          <p className="text-xs text-timeline-text-muted mt-2 leading-relaxed">
            {media.caption}
          </p>
        )}
      </div>
    );
  }

  if (media.type === "image") {
    return (
      <div className="media-embed max-w-[400px] mt-4 mb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.url}
          alt={title}
          loading="lazy"
          className="w-full h-auto rounded-lg bg-gray-100 block"
        />
        {media.caption && (
          <p className="text-xs text-timeline-text-muted mt-2 leading-relaxed">
            {media.caption}
          </p>
        )}
      </div>
    );
  }

  return null;
}
