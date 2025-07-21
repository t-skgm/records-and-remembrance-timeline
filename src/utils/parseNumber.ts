export const parseNumber = (value: string | number): number => {
  if (typeof value === "number") {
    return value;
  }

  // 数字以外の文字を削除してから数値に変換
  const cleanedValue = value.replace(/[^0-9.-]+/g, "");

  // NaNチェックを行い、変換できない場合は0を返す
  const parsedValue = Number.parseFloat(cleanedValue);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};
