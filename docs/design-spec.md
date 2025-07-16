# Monden MASAAKI 年表サイト設計資料

## 概要

ミュージシャン Monden MASAAKI の活動年表を表示する静的 Web サイト。
余裕のあるスペーシングで、モノトーンベースの柔らかいデザイン。

## 要件定義

### 機能要件

- JSON データから年表を生成・表示
- 年単位の大セクション、月単位の小セクションで構成
- PC 対象（モバイルは将来対応）
- 静的サイト生成

### データ構造

#### JSON スキーマ

```json
{
  "timeline": [
    {
      "id": "unique-id",
      "date": "2024-01-15",
      "title": "イベントタイトル",
      "description": "リッチテキスト形式の説明文（HTML可）",
      "projectCategory": "プロジェクト名/分類",
      "eventType": "live|release|collaboration|other",
      "media": {
        "type": "image|youtube|none",
        "url": "メディアURL",
        "caption": "キャプション（オプション）"
      }
    }
  ]
}
```

#### データ項目詳細

- **date**: 西暦形式（YYYY-MM-DD）
- **title**: イベントタイトル
- **description**: HTML 対応のリッチテキスト
- **projectCategory**: 音楽プロジェクトの分類
- **eventType**: イベント種別（ライブ/リリース等）
- **media**: 画像や YouTube 埋め込み（オプション）

## UI/UX デザイン

### セクション

- **年セクション**: 大きな横書きタイトル
- **月セクション**: 月タイトル + イベントリスト
- **イベント表示**: タイトル・説明文を配置

### デザインガイドライン

- **カラーパレット**: モノトーン（白・黒・グレー）
- **フォント**: 日本語が読みやすいフォント（明朝体推奨）
- **余白**: 柔らかい印象を与える十分な余白
- **アクセント**: メディア要素で視覚的変化を演出

## 技術仕様

### 推奨技術スタック

- **フレームワーク**: Next.js（静的エクスポート）
- **スタイリング**: CSS Modules + CSS Grid/Flexbox
- **ビルド**: 静的サイト生成（next export）
- **ホスティング**: Vercel/Netlify/GitHub Pages

## ファイル構成

```
/
├── public/
│   ├── data/
│   │   └── timeline.json
│   └── images/
├── src/
│   ├── components/
│   │   ├── Timeline.tsx
│   │   ├── YearSection.tsx
│   │   ├── MonthSection.tsx
│   │   └── EventItem.tsx
│   ├── styles/
│   │   ├── Timeline.module.css
│   │   └── globals.css
│   └── pages/
│       └── index.tsx
└── next.config.js
```

## 実装ステップ

1. Next.js プロジェクト初期化
2. 基本レイアウト CSS 実装
3. JSON 読み込み・パース機能
4. 年/月セクション コンポーネント実装
5. イベント表示コンポーネント実装
6. メディア埋め込み機能
7. スタイル調整・レスポンシブ対応
8. 静的エクスポート設定

## SEO 対応

- meta tags（title, description, OGP）
- 構造化データ（JSON-LD）
- 適切な HTML セマンティクス
- sitemap.xml 生成

## パフォーマンス考慮

- 画像最適化（next/image）
- 遅延読み込み（Intersection Observer）
- CSS/JS 最小化
- CDN 配信対応

---

_この設計資料は実装チームへの引き継ぎ用として作成されています。_
