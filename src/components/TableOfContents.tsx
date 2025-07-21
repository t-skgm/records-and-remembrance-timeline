"use client";

import { useState, useCallback } from "react";
import { useTocData } from '../hooks/useTocData';
import { TocHeader } from './TableOfContents/TocHeader';
import { TocYearItem } from './TableOfContents/TocYearItem';
import { tocContainerStyles, tocContentStyles } from '../utils/tocStyles';
import type { TableOfContentsProps } from '../types/toc';

export function TableOfContents({
  containerRef,
  currentYear,
  currentMonth,
  onNavigate,
}: TableOfContentsProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { tocItems, isLoading } = useTocData({ containerRef });

  const handleToggle = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const handleNavigate = useCallback((year: string, month?: string, date?: string) => {
    onNavigate(year, month, date);
  }, [onNavigate]);

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
