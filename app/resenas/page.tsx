import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

export default function ResenasPage() {
  const resenasDir = path.join(process.cwd(), "content", "resenas");
  const files = fs.readdirSync(resenasDir);

  const slugs = files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Reseñas</h1>
      <p className="mt-2 text-slate-600">
        Todas las reseñas de Código Vinario 🍷
      </p>

      <ul className="mt-6 space-y-3">
        {slugs.map((slug) => (
          <li
            key={slug}
            className="rounded-xl border p-4 hover:bg-slate-50"
          >
            <Link href={`/resenas/${slug}`} className="font-medium">
              {slug.replaceAll("-", " ")}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
