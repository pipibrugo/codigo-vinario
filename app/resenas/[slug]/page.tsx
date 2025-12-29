import { notFound } from "next/navigation";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";

export async function generateStaticParams() {
  const resenasDir = path.join(process.cwd(), "content", "resenas");
  const files = await fs.readdir(resenasDir);

  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(".mdx", "") }));
}

export default async function ResenaDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const filePath = path.join(process.cwd(), "content", "resenas", `${slug}.mdx`);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { content, data } = matter(raw);

    const { content: MDXContent } = await compileMDX({
      source: content,
      options: { mdxOptions: {} },
    });

    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="mb-6">
          <a className="text-sm text-slate-600 hover:underline" href="/resenas">
            ← Volver a reseñas
          </a>
        </div>

        <header className="mb-6">
          <h1 className="text-3xl font-bold">{String(data.title ?? slug)}</h1>
          <p className="mt-2 text-slate-600">
            {data.winery ? String(data.winery) : ""}{" "}
            {data.varietal ? `· ${String(data.varietal)}` : ""}{" "}
            {data.region ? `· ${String(data.region)}` : ""}
          </p>
        </header>

        <article className="prose prose-slate max-w-none">{MDXContent}</article>
      </main>
    );
  } catch {
    notFound();
  }
}
