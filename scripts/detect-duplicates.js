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

// 重複の可能性を検出
function findPotentialDuplicates(entries, dateThreshold = 0, titleSimilarityThreshold = 0.8) {
  const duplicates = [];
  
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const entry1 = entries[i];
      const entry2 = entries[j];
      
      // 日付が同じまたは近い場合
      const date1 = new Date(entry1.date);
      const date2 = new Date(entry2.date);
      const dateDiff = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24); // 日数差
      
      if (dateDiff <= dateThreshold) {
        // タイトルの類似度をチェック
        const normalizedTitle1 = normalizeTitle(entry1.title);
        const normalizedTitle2 = normalizeTitle(entry2.title);
        const titleSim = similarity(normalizedTitle1, normalizedTitle2);
        
        if (titleSim >= titleSimilarityThreshold) {
          duplicates.push({
            similarity: titleSim,
            dateDiff: dateDiff,
            entries: [entry1, entry2],
            reason: `同日・類似タイトル (類似度: ${(titleSim * 100).toFixed(1)}%)`
          });
        }
      }
    }
  }
  
  return duplicates.sort((a, b) => b.similarity - a.similarity);
}

async function main() {
  try {
    console.log('🔍 timeline.jsonの重複エントリを検出中...\n');
    
    const timelineData = JSON.parse(fs.readFileSync(timelineJsonPath, 'utf8'));
    const entries = timelineData.timeline;
    
    console.log(`📊 総エントリ数: ${entries.length}`);
    
    // 重複を検出
    const duplicates = findPotentialDuplicates(entries);
    
    if (duplicates.length === 0) {
      console.log('✅ 重複エントリは見つかりませんでした。');
      return;
    }
    
    console.log(`\n🚨 重複の可能性があるエントリグループ: ${duplicates.length}組\n`);
    
    // 重複をグループ化して表示
    duplicates.forEach((dup, index) => {
      console.log(`--- 重複グループ ${index + 1} ---`);
      console.log(`理由: ${dup.reason}`);
      console.log(`日付差: ${dup.dateDiff}日\n`);
      
      dup.entries.forEach((entry, entryIndex) => {
        console.log(`  ${entryIndex + 1}. ID: ${entry.id}`);
        console.log(`     日付: ${entry.date}`);
        console.log(`     タイトル: ${entry.title}`);
        console.log(`     説明: ${entry.description}`);
        console.log(`     カテゴリ: ${entry.projectCategory}`);
        console.log(`     イベント種別: ${entry.eventType}`);
        console.log('');
      });
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    });
    
    // 統計情報
    const dateGroups = {};
    duplicates.forEach(dup => {
      dup.entries.forEach(entry => {
        if (!dateGroups[entry.date]) {
          dateGroups[entry.date] = [];
        }
        dateGroups[entry.date].push(entry);
      });
    });
    
    console.log('📈 日付別重複統計:');
    Object.keys(dateGroups).sort().forEach(date => {
      const count = dateGroups[date].length;
      if (count > 1) {
        console.log(`  ${date}: ${count}件の重複候補`);
      }
    });
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

main();