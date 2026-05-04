import { FormEvent, useState } from "react";
import { api, parseSlug } from "../api";

export function AddPage() {
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
      const result = await api.addProblem({
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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">Add Problem</h2>
      <p className="mt-1 text-sm text-slate-500">Paste a LeetCode link to add it to your review queue.</p>
      <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-2 text-sm font-bold">
          LeetCode URL
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="https://leetcode.com/problems/two-sum/"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            required
          />
        </label>
        <button className="w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white" type="submit">
          Add to Queue
        </button>
        {message && <p className="text-sm font-semibold text-green-700">{message}</p>}
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      </form>
    </section>
  );
}
