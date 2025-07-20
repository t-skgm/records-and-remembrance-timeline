"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { EventType } from "@/types/timeline";
import { eventTypeDisplayNames } from "@/utils/timelineData";

interface TimelineFilterProps {
  eventTypes: EventType[];
  selectedEventTypes: EventType[];
  onEventTypesChange: (eventTypes: EventType[]) => void;
  projectCategories: string[];
  selectedProjectCategories: string[];
  onProjectCategoriesChange: (categories: string[]) => void;
  onReset: () => void;
}

export function TimelineFilter({
  eventTypes,
  projectCategories,
  selectedEventTypes,
  selectedProjectCategories,
  onEventTypesChange,
  onProjectCategoriesChange,
  onReset,
}: TimelineFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEventTypeToggle = (eventType: EventType) => {
    const newSelection = selectedEventTypes.includes(eventType)
      ? selectedEventTypes.filter((type) => type !== eventType)
      : [...selectedEventTypes, eventType];
    onEventTypesChange(newSelection);
  };

  const handleProjectCategoryToggle = (category: string) => {
    const newSelection = selectedProjectCategories.includes(category)
      ? selectedProjectCategories.filter((cat) => cat !== category)
      : [...selectedProjectCategories, category];
    onProjectCategoriesChange(newSelection);
  };

  const activeFiltersCount =
    selectedEventTypes.length + selectedProjectCategories.length;

  return (
    <div
      className={clsx(
        "fixed top-20 left-5 md:left-5 transition-all duration-300 ease-in-out z-[90]",
        isExpanded ? "w-72 md:w-80 max-h-[calc(100vh-160px)]" : "w-auto"
      )}
    >
      {/* アイコンボタン（折りたたみ時） */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className={clsx(
            "relative bg-white/95 backdrop-blur-sm border border-gray-300",
            "rounded-lg shadow-lg hover:shadow-xl transition-all duration-200",
            "flex items-center gap-2 px-3 py-2 hover:scale-105",
            "text-sm font-medium text-gray-700"
          )}
          title="フィルターを表示"
        >
          <span>🔍 フィルター</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[16px] h-4 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      ) : (
        /* 展開時のコンテンツ */
        <div
          className={clsx(
            "bg-white/95 backdrop-blur-sm border border-gray-200",
            "rounded-lg shadow-lg text-sm overflow-hidden"
          )}
        >
          {/* フィルターヘッダー */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">🔍 フィルター</span>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1"
              title="フィルターを折りたたみ"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* フィルターコンテンツ */}
          <div className="px-4 pb-4 max-h-[calc(100vh-220px)] overflow-y-auto">
            <div className="space-y-6 pt-4">
              {/* イベントタイプフィルター */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  イベントタイプ
                </h3>
                <div className="space-y-2">
                  {eventTypes.map((eventType) => (
                    <label key={eventType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedEventTypes.includes(eventType)}
                        onChange={() => handleEventTypeToggle(eventType)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {eventTypeDisplayNames[eventType] || eventType}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* プロジェクトカテゴリフィルター */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  プロジェクト
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {projectCategories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedProjectCategories.includes(category)}
                        onChange={() => handleProjectCategoryToggle(category)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* リセットボタン */}
              {activeFiltersCount > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={onReset}
                    className={clsx(
                      "px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900",
                      "border border-gray-300 hover:border-gray-400 rounded",
                      "transition-colors"
                    )}
                  >
                    フィルターをリセット
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
