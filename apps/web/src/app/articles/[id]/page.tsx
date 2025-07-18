import { getAllArticles, getArticleByFilename } from "@/utils/articleLoader";
import { ArticlePage } from "@/components/ArticlePage";
import Link from "next/link";
import { Metadata } from "next";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((filename) => ({ id: filename.replace(".md", "") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const article = await getArticleByFilename(`${id}.md`);
    return {
      title: `${article.frontmatter.title || "タイトルなし"} - Records and remembrance: Timeline`,
      description:
        article.frontmatter.description ||
        `${article.frontmatter.title || "タイトルなし"}の記事`,
      openGraph: {
        title: article.frontmatter.title || "タイトルなし",
        description:
          article.frontmatter.description ||
          `${article.frontmatter.title || "タイトルなし"}の記事`,
        type: "article",
        publishedTime: article.frontmatter.date,
        tags: article.frontmatter.tags || [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for article:", error);
    return {
      title: "記事が見つかりません - Records and remembrance: Timeline",
      description: "お探しの記事は存在しないか、削除された可能性があります。",
    };
  }
}

export default async function Article({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const article = await getArticleByFilename(`${id}.md`);
    return <ArticlePage article={article} />;
  } catch (error) {
    console.error("Error loading article:", error);
    return (
      <div className="min-h-screen bg-timeline-bg flex items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-timeline-text-primary mb-4">
            記事が見つかりません
          </h1>
          <p className="text-timeline-text-secondary mb-6">
            お探しの記事は存在しないか、削除された可能性があります。
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-timeline-accent hover:underline"
          >
            ← タイムラインに戻る
          </Link>
        </div>
      </div>
    );
  }
}
