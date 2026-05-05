import { useEffect, useState } from "react";
import { api, DueItem } from "../api";

type TodayPageProps = {
  userId: string;
};

function difficultyClass(value: string): string {
  const normalized = value.toLowerCase();
  if (normalized === "easy") return "bg-green-100 text-green-800";
  if (normalized === "medium") return "bg-amber-100 text-amber-800";
  if (normalized === "hard") return "bg-red-100 text-red-800";
  return "bg-slate-200 text-slate-700";
}

export function TodayPage({ userId }: TodayPageProps) {
  const [items, setItems] = useState<DueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await api.getDue(userId));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function review(problemId: string, quality: 1 | 3 | 5) {
    await api.review(userId, problemId, quality);
    await load();
  }

  useEffect(() => {
    void load();
  }, [userId]);

  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">Loading...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <p className="text-sm font-bold text-slate-500">Due Today</p>
            <span className="inline-flex rounded-lg bg-indigo-100 p-2 text-indigo-700">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M3 10h18" />
              </svg>
            </span>
          </div>
          <h3 className="mt-2 text-3xl font-extrabold text-indigo-700">{items.length}</h3>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <p className="text-sm font-bold text-slate-500">Focus</p>
            <span className="inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </span>
          </div>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900">{items.length ? "Review" : "Rest"}</h3>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <p className="text-sm font-bold text-slate-500">Status</p>
            <span className="inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="m9 11 3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </span>
          </div>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900">{items.length ? "Pending" : "Done"}</h3>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-900">Todo Review</h2>
          <p className="text-sm text-slate-600">Problems currently due for spaced repetition.</p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
            <span className="inline-flex rounded-full bg-emerald-100 p-3 text-emerald-700">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="m9 12 2 2 4-4" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </span>
            <p className="text-sm font-semibold text-slate-600">No problems are due for review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto px-5 pb-4 pt-2">
            <table className="w-full min-w-[980px] border-collapse text-sm">
              <thead>
                <tr className="text-left uppercase tracking-wider text-slate-500">
                  <th className="py-3">Problem</th>
                  <th className="py-3">URL</th>
                  <th className="py-3">Difficulty</th>
                  <th className="py-3">Rep</th>
                  <th className="py-3">How u feel 😏</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.problemId} className="border-t border-slate-100">
                    <td className="py-3 font-semibold">
                      <a href={item.problem.url} target="_blank" rel="noreferrer" className="hover:text-indigo-700">
                        {item.problem.title}
                      </a>
                    </td>
                    <td className="py-3">
                      <a
                        href={item.problem.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-[250px] items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
                        title={item.problem.url}
                      >
                        <span className="truncate">{item.problem.url}</span>
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M7 17 17 7" />
                          <path d="M7 7h10v10" />
                        </svg>
                      </a>
                    </td>
                    <td className="py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${difficultyClass(item.problem.difficulty)}`}>
                        {item.problem.difficulty}
                      </span>
                    </td>
                    <td className="py-3">{item.repetition}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-red-100 px-3 py-1.5 font-bold text-red-700" onClick={() => review(item.problemId, 1)}>
                          Again
                        </button>
                        <button className="rounded-lg bg-blue-100 px-3 py-1.5 font-bold text-blue-700" onClick={() => review(item.problemId, 3)}>
                          Good
                        </button>
                        <button className="rounded-lg bg-green-100 px-3 py-1.5 font-bold text-green-700" onClick={() => review(item.problemId, 5)}>
                          Easy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
