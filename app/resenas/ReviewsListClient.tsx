"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ReviewMeta = {
  slug: string;
  title: string;
  date?: string;
  winery?: string;
  varietal?: string;
  region?: string;
  score?: number;
};

type SortKey =
  | "date_desc"
  | "date_asc"
  | "score_desc"
  | "score_asc"
  | "title_asc";

export default function ReviewsListClient({
  reviews,
}: {
  reviews: ReviewMeta[];
}) {
  const [q, setQ] = useState("");
  const [varietal, setVarietal] = useState<string>("all");
  const [region, setRegion] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date_desc");

  const varietalOptions = useMemo(() => {
    const set = new Set<string>();
    for (const r of reviews) if (r.varietal) set.add(r.varietal);
    return ["all", ...Array.from(set).sort()];
  }, [reviews]);

  const regionOptions = useMemo(() => {
    const set = new Set<string>();
    for (const r of reviews) if (r.region) set.add(r.region);
    return ["all", ...Array.from(set).sort()];
  }, [reviews]);

  const filteredAndSorted = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = reviews;

    if (varietal !== "all") {
      list = list.filter((r) => r.varietal === varietal);
    }

    if (region !== "all") {
      list = list.filter((r) => r.region === region);
    }

    if (query) {
      list = list.filter((r) => {
        const haystack = [
          r.title,
          r.winery,
          r.varietal,
          r.region,
          r.date,
          r.slug,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      });
    }

    return [...list].sort((a, b) => {
      if (sortKey === "title_asc") return a.title.localeCompare(b.title);
      if (sortKey === "score_desc")
        return (b.score ?? -Infinity) - (a.score ?? -Infinity);
      if (sortKey === "score_asc")
        return (a.score ?? Infinity) - (b.score ?? Infinity);

      const ad = a.date ?? "";
      const bd = b.date ?? "";
      if (sortKey === "date_asc") return ad.localeCompare(bd);
      return bd.localeCompare(ad);
    });
  }, [q, varietal, region, sortKey, reviews]);

  return (
    <>
      {/* CONTROLES */}
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por vino, bodega, uva, región…"
          className="md:col-span-2 w-full rounded-xl border border-vinario-uvaBorder bg-white/90 text-black px-4 py-3 outline-none focus:ring-2 focus:ring-vinario-uva"
        />

        <select
          value={varietal}
          onChange={(e) => setVarietal(e.target.value)}
          className="w-full rounded-xl border border-vinario-uvaBorder bg-white/90 text-black px-4 py-3 outline-none focus:ring-2 focus:ring-vinario-uva"
        >
          {varietalOptions.map((v) => (
            <option key={v} value={v}>
              {v === "all" ? "Todas las uvas" : v}
            </option>
          ))}
        </select>

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full rounded-xl border border-vinario-uvaBorder bg-white/90 text-black px-4 py-3 outline-none focus:ring-2 focus:ring-vinario-uva"
        >
          {regionOptions.map((r) => (
            <option key={r} value={r}>
              {r === "all" ? "Todas las regiones" : r}
            </option>
          ))}
        </select>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="md:col-span-2 w-full rounded-xl border border-vinario-uvaBorder bg-white/90 text-black px-4 py-3 outline-none focus:ring-2 focus:ring-vinario-uva"
        >
          <option value="date_desc">Orden: más recientes</option>
          <option value="date_asc">Orden: más antiguas</option>
          <option value="score_desc">Orden: puntaje (alto → bajo)</option>
          <option value="score_asc">Orden: puntaje (bajo → alto)</option>
          <option value="title_asc">Orden: título (A → Z)</option>
        </select>

        <button
          onClick={() => {
            setQ("");
            setVarietal("all");
            setRegion("all");
            setSortKey("date_desc");
          }}
          className="w-full rounded-xl border border-vinario-uvaBorder bg-vinario-uva px-4 py-3 text-white hover:bg-vinario-uvaSoft transition"
        >
          Limpiar filtros
        </button>
      </div>

      <p className="mt-2 text-sm text-white/80">
        Mostrando {filteredAndSorted.length} de {reviews.length}
      </p>

      {/* CARDS */}
      <div className="mt-4 grid gap-4">
        {filteredAndSorted.map((r) => (
          <Link
            key={r.slug}
            href={`/resenas/${r.slug}`}
            className="rounded-2xl border border-vinario-uvaBorder bg-vinario-uva/90 p-5 hover:bg-vinario-uvaSoft transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {r.title}
                </h2>
                <p className="mt-1 text-white/85">
                  {[r.winery, r.varietal, r.region]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {r.date && (
                  <p className="mt-2 text-sm text-white/70">
                    Fecha: {r.date}
                  </p>
                )}
              </div>

              {typeof r.score === "number" && (
                <div className="shrink-0 rounded-xl border border-vinario-uvaBorder bg-vinario-uva px-3 py-2 text-center">
                  <div className="text-xs text-white/70">Puntaje</div>
                  <div className="text-lg font-bold text-white">
                    {r.score}
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
