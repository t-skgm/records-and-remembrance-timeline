import { clsx } from 'clsx';

export const tocContainerStyles = (isCollapsed: boolean) =>
  clsx(
    "fixed top-20 right-5 md:right-5 max-h-[calc(100vh-120px)]",
    "bg-white/95 backdrop-blur-timeline border border-timeline-border",
    "rounded-xl z-[90] text-sm overflow-y-auto shadow-timeline",
    "md:text-sm text-xs",
    isCollapsed ? "p-2 w-auto" : "p-4 w-60 md:w-70"
  );

export const tocContentStyles = clsx(
  "max-h-[calc(100vh-200px)] overflow-y-auto"
);