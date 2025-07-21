"use client";

import { useState } from "react";
import { useTocData } from "./useTocData";
import { TocHeader } from "./TocHeader";
import { TocYearItem } from "./TocYearItem";
import { tocContainerStyles, tocContentStyles } from "./tocStyles";

interface TableOfContentsProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  currentYear: string;
  currentMonth: string;
  onNavigate: (year: string, month?: string, date?: string) => void;
}

export function TableOfContents({
  containerRef,
  currentYear,
  currentMonth,
  onNavigate,
}: TableOfContentsProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { tocItems, isLoading } = useTocData({ containerRef });

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigate = (year: string, month?: string, date?: string) => {
    onNavigate(year, month, date);
  };

  if (isLoading || tocItems.length === 0) return null;

  return (
    <div className={tocContainerStyles(isCollapsed)}>
      <TocHeader isCollapsed={isCollapsed} onToggle={handleToggle} />

      {!isCollapsed && (
        <div className={tocContentStyles}>
          {tocItems.map((item) => (
            <TocYearItem
              key={item.year}
              year={item.year}
              months={item.months}
              isActive={currentYear === item.year}
              currentMonth={currentMonth}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
