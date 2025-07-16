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
  currentAnchor: string;
  onNavigate: (year: string, month?: string, date?: string) => void;
}

export default function TableOfContents({
  containerRef,
  currentYear,
  currentMonth,
  currentAnchor,
  onNavigate,
}: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const copyShareURL = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}${currentAnchor || window.location.hash}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        // 簡単なフィードバック表示
        const button = document.getElementById("share-button");
        if (button) {
          const originalText = button.textContent;
          button.textContent = "✓ コピー済み";
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
      })
      .catch(() => {
        // フォールバック: テキストエリアを使用
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      });
  };

  if (tocItems.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "80px", // Below the year/month header
        right: "20px",
        width: isCollapsed
          ? "auto"
          : window.innerWidth < 768
            ? "240px"
            : "280px",
        maxHeight: "calc(100vh - 120px)",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        padding: isCollapsed ? "0.5rem" : "1rem",
        zIndex: 90,
        fontSize: "0.85rem",
        overflowY: "auto",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        // Mobile adjustments
        ...(window.innerWidth < 768 && {
          right: "10px",
          fontSize: "0.8rem",
        }),
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: isCollapsed ? 0 : "0.75rem",
          cursor: "pointer",
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {!isCollapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h4
              style={{
                margin: 0,
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#333",
              }}
            >
              目次
            </h4>
            {(currentYear || currentMonth || currentAnchor) && (
              <button
                id="share-button"
                onClick={(e) => {
                  e.stopPropagation();
                  copyShareURL();
                }}
                style={{
                  background: "none",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  padding: "0.2rem 0.4rem",
                  color: "#666",
                  transition: "all 0.2s ease",
                }}
                title="現在位置のURLをコピー"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                🔗 シェア
              </button>
            )}
          </div>
        )}
        <button
          style={{
            background: "none",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
            padding: "0.25rem",
            color: "#666",
          }}
          title={isCollapsed ? "目次を展開" : "目次を折りたたみ"}
        >
          {isCollapsed ? "📖" : "−"}
        </button>
      </div>

      {!isCollapsed && (
        <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          {tocItems.map((item) => (
            <div key={item.year} style={{ marginBottom: "0.75rem" }}>
              <div
                style={{
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                  fontWeight: 600,
                  color: currentYear === item.year ? "#0066cc" : "#333",
                  backgroundColor:
                    currentYear === item.year
                      ? "rgba(0, 102, 204, 0.1)"
                      : "transparent",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                }}
                onClick={() => onNavigate(item.year)}
                onMouseEnter={(e) => {
                  if (currentYear !== item.year) {
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentYear !== item.year) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {item.year}
              </div>
              {currentYear === item.year && (
                <div style={{ paddingLeft: "1rem", marginTop: "0.25rem" }}>
                  {item.months.map((month) => (
                    <div
                      key={`${item.year}-${month}`}
                      style={{
                        cursor: "pointer",
                        padding: "0.2rem 0.5rem",
                        fontSize: "0.8rem",
                        color: currentMonth === month ? "#0066cc" : "#666",
                        backgroundColor:
                          currentMonth === month
                            ? "rgba(0, 102, 204, 0.1)"
                            : "transparent",
                        borderRadius: "3px",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => onNavigate(item.year, month)}
                      onMouseEnter={(e) => {
                        if (currentMonth !== month) {
                          e.currentTarget.style.backgroundColor =
                            "rgba(0, 0, 0, 0.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentMonth !== month) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
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
