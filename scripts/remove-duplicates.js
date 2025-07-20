#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const timelineJsonPath = path.join(process.cwd(), 'src/data/timeline.json');

// 文字列の類似度を計算（Levenshtein距離ベース）
function similarity(str1, str2) {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i += 1) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j += 1) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }
  
  const distance = matrix[str2.length][str1.length];
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 1 : 1 - (distance / maxLength);
}

// タイトルを正規化（記号や空白を統一）
function normalizeTitle(title) {
  return title
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/'/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/[　\s]+/g, ' ')
    .trim()
    .toLowerCase();
}

// より良いエントリを選択する基準
function chooseBetterEntry(entry1, entry2) {
  // 1. より詳細な説明を持つエントリを優先
  const desc1Length = (entry1.description || "").length;
  const desc2Length = (entry2.description || "").length;
  
  if (Math.abs(desc1Length - desc2Length) > 20) {
    return desc1Length > desc2Length ? entry1 : entry2;
  }
  
  // 2. より具体的なIDを持つエントリを優先（数字のみでないもの）
  const id1HasWords = /[a-zA-Z]/.test(entry1.id.replace(/\d{4}-\d{2}-\d{2}-/, ''));
  const id2HasWords = /[a-zA-Z]/.test(entry2.id.replace(/\d{4}-\d{2}-\d{2}-/, ''));
  
  if (id1HasWords !== id2HasWords) {
    return id1HasWords ? entry1 : entry2;
  }
  
  // 3. articlePathがあるエントリを優先
  if (entry1.articlePath && !entry2.articlePath) return entry1;
  if (!entry1.articlePath && entry2.articlePath) return entry2;
  
  // 4. mediaがあるエントリを優先
  if (entry1.media && !entry2.media) return entry1;
  if (!entry1.media && entry2.media) return entry2;
  
  // 5. より短いIDを持つエントリを優先（古いデータの可能性）
  return entry1.id.length <= entry2.id.length ? entry1 : entry2;
}

// 重複を検出して削除
function removeDuplicates(entries, titleSimilarityThreshold = 0.8) {
  const toRemove = new Set();
  const duplicateGroups = [];
  
  for (let i = 0; i < entries.length; i++) {
    if (toRemove.has(i)) continue;
    
    for (let j = i + 1; j < entries.length; j++) {
      if (toRemove.has(j)) continue;
      
      const entry1 = entries[i];
      const entry2 = entries[j];
      
      // 同じ日付かチェック
      if (entry1.date === entry2.date) {
        // タイトルの類似度をチェック
        const normalizedTitle1 = normalizeTitle(entry1.title);
        const normalizedTitle2 = normalizeTitle(entry2.title);
        const titleSim = similarity(normalizedTitle1, normalizedTitle2);
        
        if (titleSim >= titleSimilarityThreshold) {
          const betterEntry = chooseBetterEntry(entry1, entry2);
          const worseEntry = betterEntry === entry1 ? entry2 : entry1;
          const worseIndex = betterEntry === entry1 ? j : i;
          
          duplicateGroups.push({
            similarity: titleSim,
            kept: betterEntry,
            removed: worseEntry,
            reason: getBetterEntryReason(betterEntry, worseEntry)
          });
          
          toRemove.add(worseIndex);
        }
      }
    }
  }
  
  // 削除対象を除いたエントリを返す
  const cleanedEntries = entries.filter((_, index) => !toRemove.has(index));
  
  return {
    cleanedEntries,
    duplicateGroups,
    removedCount: toRemove.size
  };
}

function getBetterEntryReason(kept, removed) {
  const reasons = [];
  
  if ((kept.description || "").length > (removed.description || "").length + 20) {
    reasons.push("より詳細な説明");
  }
  
  const keptHasWords = /[a-zA-Z]/.test(kept.id.replace(/\d{4}-\d{2}-\d{2}-/, ''));
  const removedHasWords = /[a-zA-Z]/.test(removed.id.replace(/\d{4}-\d{2}-\d{2}-/, ''));
  
  if (keptHasWords && !removedHasWords) {
    reasons.push("より具体的なID");
  }
  
  if (kept.articlePath && !removed.articlePath) {
    reasons.push("記事パスあり");
  }
  
  if (kept.media && !removed.media) {
    reasons.push("メディアあり");
  }
  
  if (reasons.length === 0) {
    reasons.push("より短いID/古いデータの可能性");
  }
  
  return reasons.join(", ");
}

async function main() {
  try {
    console.log('🧹 timeline.jsonの重複エントリを削除中...\n');
    
    const timelineData = JSON.parse(fs.readFileSync(timelineJsonPath, 'utf8'));
    const entries = timelineData.timeline;
    
    console.log(`📊 削除前エントリ数: ${entries.length}`);
    
    // 重複を削除
    const result = removeDuplicates(entries);
    
    if (result.removedCount === 0) {
      console.log('✅ 削除すべき重複エントリは見つかりませんでした。');
      return;
    }
    
    console.log(`\n🗑️ 削除されたエントリ: ${result.removedCount}件`);
    console.log(`📊 削除後エントリ数: ${result.cleanedEntries.length}\n`);
    
    // 削除詳細を表示
    console.log('--- 削除されたエントリの詳細 ---\n');
    result.duplicateGroups.forEach((group, index) => {
      console.log(`${index + 1}. 【削除】 ${group.removed.id}`);
      console.log(`   日付: ${group.removed.date}`);
      console.log(`   タイトル: ${group.removed.title}`);
      console.log(`   理由: ${group.reason}`);
      console.log(`   類似度: ${(group.similarity * 100).toFixed(1)}%`);
      console.log('');
      console.log(`   【保持】 ${group.kept.id}`);
      console.log(`   日付: ${group.kept.date}`);
      console.log(`   タイトル: ${group.kept.title}`);
      console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    });
    
    // バックアップを作成
    const backupPath = timelineJsonPath.replace('.json', '.backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(timelineData, null, 2));
    console.log(`💾 バックアップを作成しました: ${backupPath}`);
    
    // 新しいデータを保存
    const newTimelineData = {
      ...timelineData,
      timeline: result.cleanedEntries
    };
    
    fs.writeFileSync(timelineJsonPath, JSON.stringify(newTimelineData, null, 2));
    console.log(`✅ クリーンアップされたtimeline.jsonを保存しました`);
    console.log(`📈 最終結果: ${entries.length} → ${result.cleanedEntries.length} エントリ (${result.removedCount}件削除)`);
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

main();