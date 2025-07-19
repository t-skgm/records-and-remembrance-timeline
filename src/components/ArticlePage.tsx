import { clsx } from "clsx";
import Link from "next/link";

interface ArticlePageProps {
  article: {
    id: string;
    frontmatter: {
      title?: string;
      date?: string;
      tags?: string[];
      [key: string]: unknown;
    };
    content: string;
  };
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Invalid date format:", dateString, error);
    return dateString;
  }
};

export function ArticlePage({ article }: ArticlePageProps) {
  return (
    <div className="min-h-screen bg-timeline-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-timeline-text-primary mb-4 leading-tight">
            {article.frontmatter.title || "タイトルなし"}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            {article.frontmatter.date && (
              <div className="text-timeline-text-secondary text-sm">
                {formatDate(article.frontmatter.date)}
              </div>
            )}

            {article.frontmatter.tags &&
              article.frontmatter.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.frontmatter.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className={clsx(
                        "px-2 py-1 text-xs font-medium rounded-full border",
                        "bg-timeline-accent-light text-timeline-accent border-timeline-accent/30"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
          </div>
        </header>

        <article
          className={clsx(
            "prose prose-gray max-w-none",
            // 見出し
            "prose-headings:text-timeline-text-primary prose-headings:font-semibold",
            "prose-h1:text-2xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:border-b prose-h1:border-timeline-border prose-h1:pb-2",
            "prose-h2:text-xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:border-b prose-h2:border-timeline-border prose-h2:pb-1",
            "prose-h3:text-lg prose-h3:mb-3 prose-h3:mt-5",
            "prose-h4:text-base prose-h4:mb-2 prose-h4:mt-4",
            // 段落とテキスト
            "prose-p:text-timeline-text-secondary prose-p:leading-relaxed prose-p:mb-4",
            "prose-strong:text-timeline-text-primary prose-strong:font-semibold",
            "prose-em:text-timeline-text-secondary prose-em:not-italic",
            // リンク
            "prose-a:text-timeline-accent prose-a:no-underline hover:prose-a:underline prose-a:font-medium",
            "prose-a:transition-colors prose-a:duration-200",
            // リスト
            "prose-ul:text-timeline-text-secondary prose-ul:mb-4",
            "prose-ol:text-timeline-text-secondary prose-ol:mb-4",
            "prose-li:text-timeline-text-secondary prose-li:mb-1 prose-li:leading-relaxed",
            "prose-li:marker:text-timeline-accent",
            // 引用
            "prose-blockquote:text-timeline-text-secondary prose-blockquote:border-timeline-accent",
            "prose-blockquote:bg-timeline-accent-light prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r",
            "prose-blockquote:border-l-4 prose-blockquote:italic prose-blockquote:my-6",
            // コード
            "prose-code:text-timeline-text-primary prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono",
            "prose-pre:bg-gray-100 prose-pre:border prose-pre:border-timeline-border prose-pre:rounded prose-pre:p-4 prose-pre:overflow-x-auto",
            "prose-pre:text-sm prose-pre:leading-relaxed",
            // テーブル
            "prose-table:border-collapse prose-table:border prose-table:border-timeline-border prose-table:w-full",
            "prose-th:border prose-th:border-timeline-border prose-th:bg-gray-50 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-semibold",
            "prose-td:border prose-td:border-timeline-border prose-td:px-3 prose-td:py-2",
            // 水平線
            "prose-hr:border-timeline-border prose-hr:my-8"
          )}
        >
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        <footer className="mt-12 pt-8 border-t border-timeline-border">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-timeline-accent hover:underline transition-colors"
          >
            ← タイムラインに戻る
          </Link>
        </footer>
      </div>
    </div>
  );
}
