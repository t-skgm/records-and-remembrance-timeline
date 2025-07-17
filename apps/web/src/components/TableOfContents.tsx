"use client";

import { useState, useEffect } from "react";

interface TOCItem {
  year: string;
  months: string[];
}

interface TableOfContentsProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  currentYear: string;
  currentMonth: string;
  onNavigate: (year: string, month?: string, date?: string) => void;
}

export default function TableOfContents({
  containerRef,
  currentYear,
  currentMonth,
  onNavigate,
}: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const yearSections = containerRef.current.querySelectorAll(".year-section");
    const items: TOCItem[] = [];

    yearSections.forEach((yearSection) => {
      const yearTitle = yearSection.querySelector(".year-title")?.textContent;
      if (!yearTitle) return;

      const monthSections = yearSection.querySelectorAll(".month-section");
      const months: string[] = [];

      monthSections.forEach((monthSection) => {
        const monthTitle = monthSection
          .querySelector(".month-title")
          ?.textContent?.replace("月", "");
        if (monthTitle) {
          months.push(monthTitle);
        }
      });

      items.push({ year: yearTitle, months });
    });

    setTocItems(items);
  }, [containerRef]);

  if (tocItems.length === 0) return null;

  return (
    <div
      className={`fixed top-20 right-5 md:right-5 max-h-[calc(100vh-120px)] bg-white/95 backdrop-blur-timeline border border-timeline-border rounded-xl z-[90] text-sm overflow-y-auto shadow-timeline ${
        isCollapsed ? "p-2 w-auto" : "p-4 w-60 md:w-70"
      } md:text-sm text-xs`}
    >
      <div
        className={`flex justify-between items-center cursor-pointer ${
          isCollapsed ? "mb-0" : "mb-3"
        }`}
        onClick={() => setIsCollapsed(!isCollapsed)}
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
        >
          {isCollapsed ? "🗓️" : "−"}
        </button>
      </div>

      {!isCollapsed && (
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {tocItems.map((item) => (
            <div key={item.year} className="mb-3">
              <div
                className={`cursor-pointer py-1 px-2 font-semibold rounded transition-all duration-200 ${
                  currentYear === item.year
                    ? "text-timeline-accent bg-timeline-accent-light"
                    : "text-timeline-text-primary bg-transparent hover:bg-timeline-hover"
                }`}
                onClick={() => onNavigate(item.year)}
              >
                {item.year}
              </div>
              {currentYear === item.year && (
                <div className="pl-4 mt-1">
                  {item.months.map((month) => (
                    <div
                      key={`${item.year}-${month}`}
                      className={`cursor-pointer py-0.5 px-2 text-xs rounded-sm transition-all duration-200 ${
                        currentMonth === month
                          ? "text-timeline-accent bg-timeline-accent-light"
                          : "text-timeline-text-muted bg-transparent hover:bg-timeline-hover"
                      }`}
                      onClick={() => onNavigate(item.year, month)}
                    >
                      {month}月
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
