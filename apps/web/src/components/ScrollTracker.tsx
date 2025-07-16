"use client";

import { useState, useEffect, useRef } from "react";
import TableOfContents from "./TableOfContents";

interface ScrollTrackerProps {
  children: React.ReactNode;
}

export default function ScrollTracker({ children }: ScrollTrackerProps) {
  const [currentYear, setCurrentYear] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  // URL更新用のデバウンス機能
  const updateURLDebounced = useRef<NodeJS.Timeout | null>(null);
  // 初期ロードフラグ（スクロールによるURL変化を区別するため）
  const isInitialLoad = useRef(true);

  // URLアンカーから初期位置を設定（初期ロード時のみ）
  useEffect(() => {
    if (!isInitialLoad.current) return; // 初期ロード以外は無視

    const hash = window.location.hash;
    if (hash && containerRef.current) {
      // アンカーがある場合、該当セクションにスクロール
      setTimeout(() => {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
        isInitialLoad.current = false; // 初期ロード完了をマーク
      }, 100);
    } else {
      isInitialLoad.current = false; // アンカーがない場合も初期ロード完了
    }
  }, []);

  const scrollToSection = (year: string, month?: string, date?: string) => {
    let targetId = "";

    if (date) {
      targetId = `#date-${date}`;
    } else if (month) {
      targetId = `#month-${year}-${month}`;
    } else {
      targetId = `#year-${year}`;
    }

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
      // URLハッシュを更新
      window.history.replaceState({}, "", targetId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const yearSections =
        containerRef.current.querySelectorAll(".year-section");

      let foundYear = "";
      let foundMonth = "";

      yearSections.forEach((yearSection) => {
        const yearRect = yearSection.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();

        // Check if year section is currently visible
        if (
          yearRect.top <= containerRect.top + 100 &&
          yearRect.bottom > containerRect.top
        ) {
          foundYear =
            yearSection.querySelector(".year-title")?.textContent || "";

          // Find current month within this year
          const monthSections = yearSection.querySelectorAll(".month-section");
          monthSections.forEach((monthSection) => {
            const monthRect = monthSection.getBoundingClientRect();
            if (
              monthRect.top <= containerRect.top + 150 &&
              monthRect.bottom > containerRect.top
            ) {
              const monthText =
                monthSection.querySelector(".month-title")?.textContent || "";
              foundMonth = monthText.replace("月", "");
            }
          });
        }
      });

      if (foundYear !== currentYear) setCurrentYear(foundYear);
      if (foundMonth !== currentMonth) setCurrentMonth(foundMonth);

      // URL更新（デバウンス）
      if (
        foundYear &&
        (foundYear !== currentYear || foundMonth !== currentMonth)
      ) {
        if (updateURLDebounced.current) {
          clearTimeout(updateURLDebounced.current);
        }

        updateURLDebounced.current = setTimeout(() => {
          let newHash = "";
          if (foundMonth) {
            newHash = `#month-${foundYear}-${foundMonth}`;
          } else if (foundYear) {
            newHash = `#year-${foundYear}`;
          }

          if (newHash) {
            window.history.replaceState({}, "", newHash);
          }
        }, 500); // 500ms後にURL更新
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [currentYear, currentMonth]);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* Fixed header showing current year/month */}
      {(currentYear || currentMonth) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "rgba(253, 253, 253, 0.95)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #e0e0e0",
            padding: "1rem 2rem",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            fontSize: "1.2rem",
            fontWeight: 500,
            color: "#333",
            letterSpacing: "0.05em",
          }}
        >
          <span>{currentYear}</span>
          {currentMonth && <span>{currentMonth}月</span>}
        </div>
      )}

      <div
        ref={containerRef}
        className="timeline-container"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          background: "#fdfdfd",
          padding: "5rem 2rem 3rem 2rem", // Top padding increased for fixed header
          overflowY: "auto",
        }}
      >
        {children}
      </div>

      {/* Table of Contents */}
      <TableOfContents
        containerRef={containerRef}
        currentYear={currentYear}
        currentMonth={currentMonth}
        onNavigate={scrollToSection}
      />
    </div>
  );
}
