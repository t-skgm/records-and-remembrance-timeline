export interface TOCItem {
  year: string;
  months: string[];
}

export interface TableOfContentsProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  currentYear: string;
  currentMonth: string;
  onNavigate: (year: string, month?: string, date?: string) => void;
}

export interface NavigationHandler {
  (year: string, month?: string, date?: string): void;
}