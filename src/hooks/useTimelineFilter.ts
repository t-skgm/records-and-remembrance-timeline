"use client";

import { useState, useMemo } from "react";
import { TimelineEntry } from "@/types/timeline";
import { 
  getUniqueEventTypes, 
  getUniqueProjectCategories, 
  filterTimelineEntries,
  groupTimelineByYearMonth 
} from "@/utils/timelineData";

export function useTimelineFilter(allEntries: TimelineEntry[]) {
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedProjectCategories, setSelectedProjectCategories] = useState<string[]>([]);

  // ユニークな値を取得
  const eventTypes = useMemo(() => getUniqueEventTypes(allEntries), [allEntries]);
  const projectCategories = useMemo(() => getUniqueProjectCategories(allEntries), [allEntries]);

  // フィルター適用されたエントリ
  const filteredEntries = useMemo(() => {
    return filterTimelineEntries(allEntries, {
      eventTypes: selectedEventTypes,
      projectCategories: selectedProjectCategories,
    });
  }, [allEntries, selectedEventTypes, selectedProjectCategories]);

  // グループ化されたタイムライン
  const groupedTimeline = useMemo(() => {
    return groupTimelineByYearMonth(filteredEntries);
  }, [filteredEntries]);

  // フィルターリセット
  const resetFilters = () => {
    setSelectedEventTypes([]);
    setSelectedProjectCategories([]);
  };

  // フィルターが適用されているかチェック
  const hasActiveFilters = selectedEventTypes.length > 0 || selectedProjectCategories.length > 0;

  return {
    // データ
    eventTypes,
    projectCategories,
    filteredEntries,
    groupedTimeline,
    
    // 状態
    selectedEventTypes,
    selectedProjectCategories,
    hasActiveFilters,
    
    // アクション
    setSelectedEventTypes,
    setSelectedProjectCategories,
    resetFilters,
  };
}