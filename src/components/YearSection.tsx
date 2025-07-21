import { TimelineEntry } from "@/domain/timeline";
import { MonthSection } from "./MonthSection";
import { parseNumber } from "@/utils/parseNumber";

interface YearSectionProps {
  year: string;
  monthsData: { [month: string]: TimelineEntry[] };
}

export function YearSection({ year, monthsData }: YearSectionProps) {
  // Sort months in chronological order
  const sortedMonths = Object.keys(monthsData).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  return (
    <div className="year-section block w-full mb-12 relative">
      <h2
        id={`year-${year}`}
        className="year-title text-3xl font-normal text-timeline-text-primary mb-8 tracking-widest"
        data-year={parseNumber(year)}
      >
        {parseNumber(year)}年
      </h2>

      <div className="months-container">
        {sortedMonths.map((month) => (
          <MonthSection
            key={`${year}-${month}`}
            year={year}
            month={month}
            events={monthsData[month]}
          />
        ))}
      </div>
    </div>
  );
}
