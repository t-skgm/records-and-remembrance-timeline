#!/usr/bin/env node

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTICLES_DIR = path.join(__dirname, "../data/articles");
const TIMELINE_FILE = path.join(__dirname, "../src/data/timeline.json");

// Claude APIクライアントの初期化
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// イベントタイプの分類ロジック
function categorizeEventType(tags) {
  if (tags.includes("Release")) return "release";
  if (tags.includes("Live")) return "live";
  if (tags.includes("Collaboration")) return "collaboration";
  return "other";
}

// プロジェクトカテゴリの抽出ロジック
function extractProjectCategory(tags) {
  const projectTags = tags.filter(
    (tag) =>
      tag.includes("BURGER NUDS") ||
      tag.includes("Good Dog Happy Men") ||
      tag.includes("Poet-type.M") ||
      tag.includes("門田匡陽") ||
      tag.includes("GDHM") ||
      tag.includes("etc.")
  );
  return projectTags.length > 0 ? projectTags[0] : "その他";
}

// ファイル名から日付を抽出
function extractDateFromFilename(filename) {
  const match = filename.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return null;
}

// タイトルから日付を除去
function cleanTitle(title) {
  // 年月日のパターンを除去
  return title
    .replace(/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}[:\s]*/, "") // 2024-03-13: タイトル
    .trim();
}

// Claude APIによる実際のLLM要約生成
async function generateLLMSummary(content, title) {
  // APIキーが設定されていない場合はフォールバック
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn(
      "ANTHROPIC_API_KEY が設定されていません。ルールベースの要約を使用します。"
    );
    return generateFallbackSummary(content, title);
  }

  try {
    // マークダウンのクリーンアップ
    let cleanContent = content
      .replace(/^---[\s\S]*?---/m, "") // フロントマター除去
      .replace(/^#+\s.*$/gm, "") // ヘッダー除去
      .replace(/\*\s/g, "") // リスト記号除去
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // リンクをテキストのみに
      .replace(/\n+/g, " ") // 改行を空白に
      .trim();

    // Claude APIに要約を依頼
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: `以下のミュージシャンMonden MASAAKIの活動記録を、20文字程度の簡潔な要約にしてください。年表表示用なので、日付情報は不要です。

タイトル: ${title}

内容:
${cleanContent.substring(0, 1000)}

要約（20文字程度）:`,
        },
      ],
    });

    let summary = response.content[0].text.trim();

    // 長すぎる場合は切り詰め
    // if (summary.length > 25) {
    //   summary = summary.substring(0, 23) + '...';
    // }

    return summary || generateFallbackSummary(content, title);
  } catch (error) {
    console.warn(
      `Claude API エラー: ${error.message}. フォールバック要約を使用します。`
    );
    return generateFallbackSummary(content, title);
  }
}

// フォールバック用のルールベース要約
function generateFallbackSummary(content, title) {
  let cleanContent = content
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/^#+\s.*$/gm, "")
    .replace(/\*\s/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();

  const eventType = title.toLowerCase();

  if (eventType.includes("release") || cleanContent.includes("リリース")) {
    const releaseMatch = cleanContent.match(
      /リリース[：:]\s*(\d{4})年(\d{1,2})月/
    );
    const formatMatch = cleanContent.match(/形態[：:]\s*([^\n。]+)/);

    if (releaseMatch && formatMatch) {
      return `${releaseMatch[1]}年${releaseMatch[2]}月、${formatMatch[1]}をリリース`;
    } else if (releaseMatch) {
      return `${releaseMatch[1]}年${releaseMatch[2]}月リリース`;
    }
  }

  if (eventType.includes("live") || cleanContent.includes("ライブ")) {
    const venueMatch = cleanContent.match(/会場[：:]\s*([^\n。]+)/);
    if (venueMatch) {
      return `${venueMatch[1]}でライブ出演`;
    }
    return "ライブ出演";
  }

  const sentences = cleanContent
    .split(/[。．]/)
    .filter((s) => s.trim().length > 10);
  if (sentences.length > 0) {
    let summary = sentences[0].trim();
    if (summary.length > 20) {
      summary = summary.substring(0, 18) + "...";
    }
    return summary;
  }

  return "アーティスト活動";
}

// メディア情報の抽出（YouTube URL等）
function extractMedia(content) {
  // YouTube URLを検索
  const youtubeMatch = content.match(
    /https:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
  );
  if (youtubeMatch) {
    return {
      type: "youtube",
      url: youtubeMatch[0],
      caption: "",
    };
  }

  // 画像URLを検索（簡単な例）
  const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
  if (imageMatch) {
    return {
      type: "image",
      url: imageMatch[1],
      caption: "",
    };
  }

  return null;
}

// IDを生成（ファイル名ベース）
function generateId(filename) {
  return filename.replace(".md", "");
}

async function convertArticlesToTimeline() {
  try {
    // articlesディレクトリの全mdファイルを取得
    console.log("📁 記事ディレクトリを読み込み中...");
    const files = fs
      .readdirSync(ARTICLES_DIR)
      .filter((file) => file.endsWith(".md"))
      .sort(); // ファイル名でソート

    console.log(`📄 ${files.length}件のMarkdownファイルを発見しました`);

    const timeline = [];
    let processedCount = 0;

    for (const file of files) {
      const filePath = path.join(ARTICLES_DIR, file);
      const fileContent = fs.readFileSync(filePath, "utf8");

      try {
        processedCount++;

        // 進行状況表示（10件ごと、または最初の数件）
        if (processedCount <= 5 || processedCount % 10 === 0) {
          console.log(`🔄 処理中: ${processedCount}/${files.length} - ${file}`);
        }

        const { data: frontmatter, content } = matter(fileContent);

        // フロントマターから基本情報を抽出
        const rawTitle = frontmatter.title || "タイトルなし";
        const title = cleanTitle(rawTitle);
        const date = frontmatter.date
          ? new Date(frontmatter.date).toISOString().split("T")[0]
          : extractDateFromFilename(file);

        if (!date) {
          console.warn(`⚠️  日付が取得できませんでした: ${file}`);
          continue;
        }

        const tags = frontmatter.tags || [];
        const eventType = categorizeEventType(tags);
        const projectCategory = extractProjectCategory(tags);
        const media = extractMedia(content);

        // LLM要約生成中の表示
        if (processedCount <= 3) {
          console.log(`🤖 LLM要約生成中: "${title}"`);
        }

        // timeline用のデータオブジェクトを作成
        const timelineEntry = {
          id: generateId(file),
          date: date,
          title: title,
          description: await generateLLMSummary(content, title),
          projectCategory: projectCategory,
          eventType: eventType,
        };

        // メディアがある場合は追加
        if (media) {
          timelineEntry.media = media;
        }

        timeline.push(timelineEntry);
      } catch (parseError) {
        console.warn(`❌ パースエラー: ${file}`, parseError.message);
        continue;
      }
    }

    console.log(`📊 処理完了: ${timeline.length}件のエントリを生成しました`);
    console.log("🔄 日付順にソート中...");

    // 日付順でソート
    timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

    // timeline.jsonに書き込み
    console.log("💾 JSONファイルに書き込み中...");
    const timelineData = {
      timeline: timeline,
    };

    fs.writeFileSync(
      TIMELINE_FILE,
      JSON.stringify(timelineData, null, 2),
      "utf8"
    );

    console.log(
      `✅ 変換完了: ${timeline.length}件の記事をtimeline.jsonに変換しました`
    );
    console.log(`📄 出力ファイル: ${TIMELINE_FILE}`);
  } catch (error) {
    console.error("❌ 変換エラー:", error);
    process.exit(1);
  }
}

// スクリプトとして実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
  convertArticlesToTimeline();
}

export { convertArticlesToTimeline };
