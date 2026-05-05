import { FormEvent, useState } from "react";
import { api, parseSlug } from "../api";

type AddPageProps = {
  userId: string;
};

export function AddPage({ userId }: AddPageProps) {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const slug = parseSlug(url);
    if (!slug) {
      setError("Invalid URL or unable to parse the problem slug.");
      return;
    }

    try {
      const result = await api.addProblem(userId, {
        id: slug,
        title: slug,
        url
      });
      setMessage(result.message || "Problem added.");
      setUrl("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="inline-flex rounded-lg bg-indigo-100 p-2 text-indigo-700">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Add Problem</h2>
          <p className="mt-1 text-sm text-slate-600">Paste a LeetCode link to add it to your review queue.</p>
        </div>
      </div>
      <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-2 text-sm font-bold">
          LeetCode URL
          <input
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="https://leetcode.com/problems/two-sum/"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            required
          />
        </label>
        <button className="w-fit rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700" type="submit">
          Add to Queue
        </button>
        {message && <p className="text-sm font-semibold text-green-700">{message}</p>}
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      </form>
    </section>
  );
}
