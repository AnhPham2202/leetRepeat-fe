import { useEffect, useState } from "react";
import { api, DueItem } from "../api";

function difficultyClass(value: string): string {
  const normalized = value.toLowerCase();
  if (normalized === "easy") return "bg-green-100 text-green-800";
  if (normalized === "medium") return "bg-amber-100 text-amber-800";
  if (normalized === "hard") return "bg-red-100 text-red-800";
  return "bg-slate-200 text-slate-700";
}

export function TodayPage() {
  const [items, setItems] = useState<DueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await api.getDue());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function review(problemId: string, quality: 1 | 3 | 5) {
    await api.review(problemId, quality);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Due Today</p>
          <h3 className="mt-2 text-3xl font-extrabold">{items.length}</h3>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Focus</p>
          <h3 className="mt-2 text-3xl font-extrabold">{items.length ? "Review" : "Rest"}</h3>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Status</p>
          <h3 className="mt-2 text-3xl font-extrabold">{items.length ? "Pending" : "Done"}</h3>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold">Todo Review</h2>
          <p className="text-sm text-slate-500">Các bài dã t?i h?n theo spaced repetition.</p>
        </div>

        {items.length === 0 ? (
          <p className="px-5 py-8 text-sm font-semibold text-slate-500">Không có bài nào d?n h?n ôn.</p>
        ) : (
          <div className="overflow-x-auto px-5 pb-4 pt-2">
            <table className="w-full min-w-[860px] border-collapse text-sm">
              <thead>
                <tr className="text-left uppercase tracking-wider text-slate-500">
                  <th className="py-3">Problem</th>
                  <th className="py-3">Difficulty</th>
                  <th className="py-3">Rep</th>
                  <th className="py-3">Interval</th>
                  <th className="py-3">Next Review</th>
                  <th className="py-3">Actions</th>
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
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${difficultyClass(item.problem.difficulty)}`}>
                        {item.problem.difficulty}
                      </span>
                    </td>
                    <td className="py-3">{item.repetition}</td>
                    <td className="py-3">{item.interval}d</td>
                    <td className="py-3">{new Date(item.nextReview).toLocaleDateString()}</td>
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