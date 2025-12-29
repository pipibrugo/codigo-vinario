import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import ReviewsListClient from "./ReviewsListClient";

type ReviewMeta = {
  slug: string;
  title: string;
  date?: string;
  winery?: string;
  varietal?: string;
  region?: string;
  score?: number;
};

function getReviews(): ReviewMeta[] {
  const resenasDir = path.join(process.cwd(), "content", "resenas");
  const files = fs.readdirSync(resenasDir).filter((f) => f.endsWith(".mdx"));

  const reviews = files.map((file) => {
    const slug = file.replace(".mdx", "");
    const raw = fs.readFileSync(path.join(resenasDir, file), "utf8");
    const { data } = matter(raw);

    return {
      slug,
      title: String(data.title ?? slug.replaceAll("-", " ")),
      date: data.date ? String(data.date) : undefined,
      winery: data.winery ? String(data.winery) : undefined,
      varietal: data.varietal ? String(data.varietal) : undefined,
      region: data.region ? String(data.region) : undefined,
      score: typeof data.score === "number" ? data.score : undefined,
    };
  });

  reviews.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  return reviews;
}

export default function ResenasPage() {
  const reviews = getReviews();

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold">Reseñas</h1>
      <p className="mt-2 text-slate-600">Todas las reseñas de Código Vinario 🍷</p>

      <ReviewsListClient reviews={reviews} />
    </main>
  );
}
