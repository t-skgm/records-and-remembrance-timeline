/**
 * 西暦年を漢数字表記に変換する関数
 * 例: 2023 -> "二〇二三年"
 */
export function formatYearToKanji(year: number): string {
  const kanjiNumbers = [
    "〇",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
  ];

  const yearStr = year.toString();
  let result = "";

  for (const digit of yearStr) {
    result += kanjiNumbers[parseInt(digit)];
  }

  return result + "年";
}

/**
 * 月を日本語表記に変換する関数
 * 例: 1 -> "一月", 10 -> "十月"
 */
export function formatMonthToJapanese(month: number): string {
  const kanjiNumbers = [
    "",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
  ];
  const ten = "十";

  if (month <= 9) {
    return kanjiNumbers[month] + "月";
  } else if (month === 10) {
    return ten + "月";
  } else if (month === 11) {
    return ten + kanjiNumbers[1] + "月";
  } else if (month === 12) {
    return ten + kanjiNumbers[2] + "月";
  }

  return month + "月";
}
