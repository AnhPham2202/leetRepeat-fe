export type Problem = {
  id: string;
  title: string;
  difficulty: string;
  url: string;
};
export type AddProblemPayload = Omit<Problem, "difficulty">;

export type DueItem = {
  problemId: string;
  repetition: number;
  interval: number;
  nextReview: string;
  problem: Problem;
};

export type Config = {
  firstIntervalDays: number;
  repFactor: number;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(error.error ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

export const api = {
  getDue: () => request<DueItem[]>("/api/due"),
  getConfig: () => request<Config>("/api/config"),
  addProblem: (payload: AddProblemPayload) =>
    request<{ message: string }>("/api/problems", { method: "POST", body: JSON.stringify(payload) }),
  review: (problemId: string, quality: 1 | 3 | 5) => request<{ message: string }>("/api/review", { method: "POST", body: JSON.stringify({ problemId, quality }) }),
  saveConfig: (payload: Config) => request<{ message: string }>("/api/config", { method: "POST", body: JSON.stringify(payload) })
};

export function parseSlug(url: string): string | null {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/problems\/([^/]+)\/?/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}
