import { FormEvent, useEffect, useState } from "react";
import { api } from "../api";

export function SettingsPage() {
  const [firstIntervalDays, setFirstIntervalDays] = useState("1");
  const [repFactor, setRepFactor] = useState("2");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getConfig()
      .then((config) => {
        setFirstIntervalDays(String(config.firstIntervalDays));
        setRepFactor(String(config.repFactor));
      })
      .catch((err) => setError((err as Error).message));
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const parsedFirstIntervalDays = Number(firstIntervalDays);
    const parsedRepFactor = Number(repFactor);

    try {
      await api.saveConfig({ firstIntervalDays: parsedFirstIntervalDays, repFactor: parsedRepFactor });
      setMessage("Saved settings.");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">Settings</h2>
      <p className="mt-1 text-sm text-slate-500">Configure first interval and rep factor for spaced repetition.</p>

      <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-2 text-sm font-bold">
          First Interval (days)
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            type="number"
            step="0.1"
            min="1.1"
            value={repFactor}
            onChange={(event) => setRepFactor(event.target.value)}
            required
          />
        </label>

        <button className="w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white" type="submit">
          Save Settings
        </button>

        {message && <p className="text-sm font-semibold text-green-700">{message}</p>}
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      </form>
    </section>
  );
}
