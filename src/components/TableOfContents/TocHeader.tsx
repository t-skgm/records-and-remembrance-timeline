import { clsx } from 'clsx';

interface TocHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function TocHeader({ isCollapsed, onToggle }: TocHeaderProps) {
  return (
    <div
      className={clsx(
        "flex justify-between items-center cursor-pointer",
        isCollapsed ? "mb-0" : "mb-3"
      )}
      onClick={onToggle}
    >
      {!isCollapsed && (
        <div className="flex items-center gap-2">
          <h4 className="m-0 text-sm font-semibold text-timeline-text-primary">
            目次
          </h4>
        </div>
      )}
      <button
        className="bg-none border-none text-base cursor-pointer p-1 text-timeline-text-muted"
        title={isCollapsed ? "目次を展開" : "目次を折りたたみ"}
        type="button"
      >
        {isCollapsed ? "🗓️" : "−"}
      </button>
    </div>
  );
}