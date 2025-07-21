import { clsx } from 'clsx';
import { TocMonthItem } from './TocMonthItem';

interface TocYearItemProps {
  year: string;
  months: string[];
  isActive: boolean;
  currentMonth: string;
  onNavigate: (year: string, month?: string) => void;
}

export function TocYearItem({
  year,
  months,
  isActive,
  currentMonth,
  onNavigate
}: TocYearItemProps) {
  const handleYearClick = () => {
    onNavigate(year);
  };

  const handleMonthClick = (selectedMonth: string) => {
    onNavigate(year, selectedMonth);
  };

  return (
    <div className="mb-3">
      <div
        className={clsx(
          "cursor-pointer py-1 px-2 font-semibold rounded transition-all duration-200",
          isActive
            ? "text-timeline-accent bg-timeline-accent-light"
            : "text-timeline-text-primary bg-transparent hover:bg-timeline-hover"
        )}
        onClick={handleYearClick}
      >
        {year}
      </div>
      {isActive && (
        <div className="pl-4 mt-1">
          {months.map((month) => (
            <TocMonthItem
              key={`${year}-${month}`}
              year={year}
              month={month}
              isActive={currentMonth === month}
              onNavigate={handleMonthClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}