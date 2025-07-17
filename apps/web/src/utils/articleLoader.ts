import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

export async function getAllArticles() {
  const articlesDir = path.join(process.cwd(), "src/data/articles");
  try {
    const filenames = fs.readdirSync(articlesDir);
    return filenames.filter((name) => name.endsWith(".md"));
  } catch (error) {
    console.error("Error reading articles directory:", error);
    return [];
  }
}

export async function getArticleByFilename(filename: string) {
  const fullPath = path.join(process.cwd(), "src/data/articles", filename);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const processedContent = await remark()
      .use(remarkGfm)
      .use(html)
      .process(content);

    return {
      id: filename.replace(".md", ""),
      frontmatter: data,
      content: processedContent.toString(),
    };
  } catch (error) {
    console.error(`Error reading article ${filename}:`, error);
    throw new Error(`Article not found: ${filename}`);
  }
}

export async function articleExists(articleId: string): Promise<boolean> {
  const articlesDir = path.join(process.cwd(), "src/data/articles");
  const filePath = path.join(articlesDir, `${articleId}.md`);

  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(`Error checking article existence ${articleId}:`, error);
    return false;
  }
}
