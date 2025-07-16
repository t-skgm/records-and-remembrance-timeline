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
    <div
      className="year-section"
      style={{
        display: "block",
        width: "100%",
        marginBottom: "3rem",
        position: "relative",
      }}
    >
      <h2
        id={`year-${year}`}
        className="year-title"
        style={{
          fontSize: "2rem",
          fontWeight: 400,
          color: "#333",
          marginBottom: "2rem",
          letterSpacing: "0.1em",
        }}
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
