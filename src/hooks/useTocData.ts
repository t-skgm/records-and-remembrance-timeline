import { useState, useEffect, useMemo } from 'react';

export interface TOCItem {
  year: string;
  months: string[];
}

interface UseTocDataOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useTocData({ containerRef }: UseTocDataOptions) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const extractTocData = useMemo(() => {
    return (container: HTMLDivElement): TOCItem[] => {
      const yearSections = container.querySelectorAll('.year-section');
      const items: TOCItem[] = [];

      yearSections.forEach((yearSection) => {
        const yearElement = yearSection.querySelector('.year-title');
        const yearTitle = yearElement?.getAttribute('data-year');
        
        if (!yearTitle) return;

        const monthSections = yearSection.querySelectorAll('.month-section');
        const months: string[] = [];

        monthSections.forEach((monthSection) => {
          const monthElement = monthSection.querySelector('.month-title');
          const monthTitle = monthElement?.getAttribute('data-month');
          
          if (monthTitle) {
            months.push(monthTitle);
          }
        });

        items.push({ year: yearTitle, months });
      });

      return items;
    };
  }, []);

  useEffect(() => {
    const updateTocItems = () => {
      if (!containerRef.current) {
        setIsLoading(false);
        return;
      }

      try {
        const newItems = extractTocData(containerRef.current);
        setTocItems(newItems);
      } catch (error) {
        console.error('Failed to extract TOC data:', error);
        setTocItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    updateTocItems();

    if (!containerRef.current) return;

    const observer = new MutationObserver(() => {
      updateTocItems();
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-year', 'data-month']
    });

    return () => observer.disconnect();
  }, [containerRef, extractTocData]);

  return { tocItems, isLoading };
}