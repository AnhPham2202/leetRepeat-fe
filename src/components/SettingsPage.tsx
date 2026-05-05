import { FormEvent, useEffect, useState } from "react";
import { api } from "../api";

type SettingsPageProps = {
  userId: string;
};

export function SettingsPage({ userId }: SettingsPageProps) {
  const [firstIntervalDays, setFirstIntervalDays] = useState("1");
  const [repFactor, setRepFactor] = useState("2");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getConfig(userId)
      .then((config) => {
        setFirstIntervalDays(String(config.firstIntervalDays));
        setRepFactor(String(config.repFactor));
      })
      .catch((err) => setError((err as Error).message));
  }, [userId]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const parsedFirstIntervalDays = Number(firstIntervalDays);
    const parsedRepFactor = Number(repFactor);

    try {
      await api.saveConfig(userId, { firstIntervalDays: parsedFirstIntervalDays, repFactor: parsedRepFactor });
      setMessage("Saved settings.");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="inline-flex rounded-lg bg-violet-100 p-2 text-violet-700">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1v.17a2 2 0 1 1-4 0V21a1.65 1.65 0 0 0-.33-1 1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1-.33H2.83a2 2 0 1 1 0-4H3a1.65 1.65 0 0 0 1-.33 1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1V2.83a2 2 0 1 1 4 0V3a1.65 1.65 0 0 0 .33 1 1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.24.32.45.67.6 1 .16.33.24.68.24 1.03s-.08.7-.24 1.03c-.15.33-.36.68-.6 1Z" />
          </svg>
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Settings</h2>
          <p className="mt-1 text-sm text-slate-600">Configure first interval and rep factor for spaced repetition.</p>
        </div>
      </div>

      <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-2 text-sm font-bold">
          First Interval (days)
          <input
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            type="number"
            min="1"
            step="1"
            value={firstIntervalDays}
            onChange={(event) => setFirstIntervalDays(event.target.value)}
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-bold">
          Rep Factor
          <input
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            type="number"
            step="0.1"
            min="1.1"
            value={repFactor}
            onChange={(event) => setRepFactor(event.target.value)}
            required
          />
        </label>

        <button className="w-fit rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-700" type="submit">
          Save Settings
        </button>

        {message && <p className="text-sm font-semibold text-green-700">{message}</p>}
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      </form>
    </section>
  );
}
