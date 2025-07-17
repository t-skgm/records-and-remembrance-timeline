import { TimelineEntry } from "@/types/timeline";
import MonthSection from "./MonthSection";

interface YearSectionProps {
  year: string;
  monthsData: { [month: string]: TimelineEntry[] };
}

export default function YearSection({ year, monthsData }: YearSectionProps) {
  // Sort months in chronological order
  const sortedMonths = Object.keys(monthsData).sort(
    (a, b) => parseInt(a) - parseInt(b),
  );

  return (
    <div className="year-section block w-full mb-12 relative">
      <h2
        id={`year-${year}`}
        className="year-title text-3xl font-normal text-timeline-text-primary mb-8 tracking-widest"
      >
        {year}
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
