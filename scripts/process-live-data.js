#!/usr/bin/env node

import fs from "fs";

const LIVE_ALL_FILE = "./data/liveAll.md";
const TIMELINE_FILE = "./src/data/timeline.json";

// liveAll.mdファイルを読み取り、ライブイベント情報を抽出
function parseLiveAllData() {
  const content = fs.readFileSync(LIVE_ALL_FILE, "utf-8");
  const lines = content.split("\n");

  const events = [];
  let inTable = false;

  for (const line of lines) {
    // テーブルの開始を検出
    if (line.includes("| 名義")) {
      inTable = true;
      continue;
    }

    // テーブルのヘッダー区切り行をスキップ
    if (line.includes("|---") || line.includes("|--")) {
      continue;
    }

    // テーブル内の行を処理
    if (inTable && line.startsWith("|")) {
      const cells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell);

      if (cells.length >= 4) {
        const [artistName, dateStr, _eventName, venue, _notes = ""] = cells;
        // `(())` で囲まれた部分は共演アーティストのため、eventNameと共演アーティストを分離する
        const eventNameMatch = _eventName.match(/^(.*?)\s*\(\((.*?)\)\)$/);
        const eventName = eventNameMatch
          ? eventNameMatch[1].trim()
          : _eventName;
        const featuredArtists = eventNameMatch ? eventNameMatch[2].trim() : "";
        const notes =
          `${_notes}\n${featuredArtists ? `共演: ${featuredArtists}` : ""}`.trim();

        // 日付の処理
        let date = null;
        let hasDetailPage = false;

        // リンク形式の日付を処理
        const linkMatch = dateStr.match(/\[([^\]]+)\]/);
        if (linkMatch) {
          date = linkMatch[1];
          hasDetailPage = true;
        } else {
          date = dateStr;
        }

        // 日付フォーマットの正規化
        if (date && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          events.push({
            artistName: artistName,
            date: date,
            eventName: eventName || "",
            venue: venue || "",
            notes: notes || "",
            hasDetailPage: hasDetailPage,
          });
        } else if (date && date.match(/^\d{4}-\d{2}-xx$/)) {
          // 不完全な日付の場合は01日として処理
          const normalizedDate = date.replace("-xx", "-01");
          events.push({
            artistName: artistName,
            date: normalizedDate,
            eventName: eventName || "",
            venue: venue || "",
            notes: notes || "",
            hasDetailPage: hasDetailPage,
          });
        }
      }
    }

    // テーブルの終了を検出（空行など）
    if (inTable && line.trim() === "") {
      break;
    }
  }

  return events;
}

// 既存のtimeline.jsonを読み取り
function loadTimelineData() {
  const content = fs.readFileSync(TIMELINE_FILE, "utf-8");
  return JSON.parse(content);
}

// 重複チェック（同じ日付で似たようなタイトル）
function isDuplicate(newEvent, existingEntries) {
  for (const entry of existingEntries) {
    if (entry.date === newEvent.date) {
      // タイトルの類似度チェック（簡単な文字列比較）
      const existingTitle = entry.title.toLowerCase();
      const newTitle = newEvent.eventName.toLowerCase();
      const newVenue = newEvent.venue.toLowerCase();

      // 会場名が含まれている場合は重複とみなす
      if (
        existingTitle.includes(newVenue) ||
        existingTitle.includes(newTitle.slice(0, 10)) ||
        (newEvent.artistName.includes("BURGER NUDS") &&
          existingTitle.includes("burger nuds"))
      ) {
        return true;
      }
    }
  }
  return false;
}

// timelineエントリを生成
function createTimelineEntry(event) {
  const eventTypes = {
    release: ["リリース", "レコ発", "インストア"],
    live: ["ライブ", "コンサート", "ツアー", "フェス", "イベント"],
    collaboration: ["コラボ", "セッション", "共演"],
    other: [],
  };

  let eventType = "live"; // デフォルトはライブ
  const eventText = (event.eventName + " " + event.notes).toLowerCase();

  for (const [type, keywords] of Object.entries(eventTypes)) {
    if (keywords.some((keyword) => eventText.includes(keyword))) {
      eventType = type;
      break;
    }
  }

  // プロジェクトカテゴリを決定
  let projectCategory = event.artistName;
  if (event.artistName.includes("BURGER NUDS")) {
    projectCategory = "BURGER NUDS";
  } else if (event.artistName.includes("Good Dog Happy Men")) {
    projectCategory = "Good Dog Happy Men";
  } else if (event.artistName.includes("Poet-type.M")) {
    projectCategory = "Poet-type.M";
  } else if (
    event.artistName.includes("門田") ||
    event.artistName.includes("Monden") ||
    event.artistName.includes("MONDEN")
  ) {
    projectCategory = "門田匡陽";
  }

  // IDを生成
  const id = `${event.date}-${event.artistName.toLowerCase().replace(/\s+/g, "-")}`;

  // タイトルを生成
  let title = event.eventName || "Live";
  if (event.venue) {
    title += ` at ${event.venue}`;
  }

  // 説明を生成
  let description = `${event.artistName}`;
  if (event.eventName) {
    description += `のライブ「${event.eventName}」`;
  }
  if (event.venue) {
    description += `、${event.venue}にて開催`;
  }

  return {
    id: id,
    date: event.date,
    title: title,
    description: description,
    projectCategory: projectCategory,
    eventType: eventType,
  };
}

// メイン処理
function main() {
  console.log("liveAll.mdファイルを解析中...");
  const liveEvents = parseLiveAllData();
  console.log(`${liveEvents.length}件のライブイベントを抽出しました`);

  console.log("既存のtimeline.jsonを読み込み中...");
  const timelineData = loadTimelineData();
  const existingEntries = timelineData.timeline;

  console.log("重複チェック中...");
  const newEntries = [];
  let duplicateCount = 0;

  for (const event of liveEvents) {
    if (!isDuplicate(event, existingEntries)) {
      const timelineEntry = createTimelineEntry(event);
      newEntries.push(timelineEntry);
    } else {
      duplicateCount++;
    }
  }

  console.log(`${newEntries.length}件の新しいエントリを追加します`);
  console.log(`${duplicateCount}件の重複エントリをスキップしました`);

  // 新しいエントリを追加
  timelineData.timeline.push(...newEntries);

  // 日付順にソート
  timelineData.timeline.sort((a, b) => a.date.localeCompare(b.date));

  // ファイルに書き出し
  fs.writeFileSync(TIMELINE_FILE, JSON.stringify(timelineData, null, 2));
  console.log("timeline.jsonを更新しました");

  // 追加されたエントリの一部を表示
  if (newEntries.length > 0) {
    console.log("\n追加されたエントリの例:");
    newEntries.slice(0, 5).forEach((entry) => {
      console.log(`- ${entry.date}: ${entry.title}`);
    });
  }
}

main();
