import type { Meta, StoryObj } from "@storybook/nextjs";
import { YearSection } from "./YearSection";
import { TimelineEntry } from "../types/timeline";
import { groupTimelineByYearMonth } from "@/utils/timelineData";

// サンプルデータ
const sampleEvents: TimelineEntry[] = [
  {
    id: "1999-05-01-000000",
    date: "1999-04-30",
    title: "BURGER NUDS - MERANCHOLY STRANGER",
    description:
      "1999年にメランコリー・ストレンジャーを自主リリース。ギターポップ作品。BUMP OF CHICKENと偶然再会し、ライブ出演に繋がった。",
    projectCategory: "BURGER NUDS",
    eventType: "release",
  },
  {
    id: "1999-07-15-000000",
    date: "1999-07-14",
    title: "1999-07-xx: BURGER NUDS - 夢見る君と僕 at 下北沢屋根裏",
    description: "BURGER NUDS初ライブ、下北沢屋根裏でイベント出演",
    projectCategory: "BURGER NUDS",
    eventType: "live",
  },
  {
    id: "1999-08-01-000000",
    date: "1999-07-31",
    title: "BURGER NUDS - GROW TO BE A MAN",
    description:
      "1999年、パンクスタイルの自主制作カセットデビュー。音楽性は未確立ながら、後のスタイル確立につながる。",
    projectCategory: "BURGER NUDS",
    eventType: "release",
  },
];

const monthsData = groupTimelineByYearMonth(sampleEvents)[1999];

const meta: Meta<typeof YearSection> = {
  title: "Components/YearSection",
  component: YearSection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "年セクションコンポーネント。漢数字で年を表示し、その年の月別データを表示します。",
      },
    },
  },
  argTypes: {
    year: {
      control: { type: "text" },
      description: "表示する年（文字列）",
    },
    monthsData: {
      control: { type: "object" },
      description: "その年の月別イベントデータ",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    year: "1999",
    monthsData: monthsData,
  },
  parameters: {
    docs: {
      description: {
        story: "1999年のサンプルデータを表示する基本的な例",
      },
    },
  },
};

export const RecentYear: Story = {
  args: {
    year: "2024",
    monthsData: {
      "3": [
        {
          id: "2024-03-13-000000",
          date: "2024-03-13",
          title: "新作リリース",
          description: "最新アルバムのリリース記念イベント",
          projectCategory: "ソロ活動",
          eventType: "release",
        },
      ],
      "6": [
        {
          id: "2024-06-01-000000",
          date: "2024-06-01",
          title: "夏のライブツアー開始",
          description: "全国ツアーの幕開け、東京公演",
          projectCategory: "ライブ活動",
          eventType: "live",
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: "2024年の例 - より最近のデータでの表示",
      },
    },
  },
};

export const EmptyYear: Story = {
  args: {
    year: "2000",
    monthsData: {},
  },
  parameters: {
    docs: {
      description: {
        story: "イベントデータがない年の表示例",
      },
    },
  },
};

export const ManyMonths: Story = {
  args: {
    year: "2001",
    monthsData: {
      "1": [
        {
          id: "2001-01-01",
          date: "2001-01-01",
          title: "新年ライブ",
          description: "新年最初のライブ",
          projectCategory: "BURGER NUDS",
          eventType: "live",
        },
      ],
      "3": [
        {
          id: "2001-03-01",
          date: "2001-03-01",
          title: "春のリリース",
          description: "春の新作発表",
          projectCategory: "BURGER NUDS",
          eventType: "release",
        },
      ],
      "6": [
        {
          id: "2001-06-01",
          date: "2001-06-01",
          title: "夏前ライブ",
          description: "夏前の特別ライブ",
          projectCategory: "BURGER NUDS",
          eventType: "live",
        },
      ],
      "9": [
        {
          id: "2001-09-01",
          date: "2001-09-01",
          title: "秋のコラボ",
          description: "他アーティストとのコラボ",
          projectCategory: "コラボ",
          eventType: "collaboration",
        },
      ],
      "12": [
        {
          id: "2001-12-01",
          date: "2001-12-01",
          title: "年末ライブ",
          description: "年末の締めくくりライブ",
          projectCategory: "BURGER NUDS",
          eventType: "live",
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: "一年を通して多くの月にイベントがある場合の表示例",
      },
    },
  },
};
