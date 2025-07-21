import { clsx } from 'clsx';

interface TocMonthItemProps {
  year: string;
  month: string;
  isActive: boolean;
  onNavigate: (year: string, month: string) => void;
}

export function TocMonthItem({ year, month, isActive, onNavigate }: TocMonthItemProps) {
  const handleClick = () => {
    onNavigate(year, month);
  };

  return (
    <div
      className={clsx(
        "cursor-pointer py-0.5 px-2 text-xs rounded-sm transition-all duration-200",
        isActive
          ? "text-timeline-accent bg-timeline-accent-light"
          : "text-timeline-text-muted bg-transparent hover:bg-timeline-hover"
      )}
      onClick={handleClick}
    >
      {month}月
    </div>
  );
}