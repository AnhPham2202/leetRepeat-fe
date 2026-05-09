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

function withQuery(path: string, params: Record<string, string>): string {
  const query = new URLSearchParams(params);
  return `${path}?${query.toString()}`;
}

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
  userExists: (userId: string) => request<{ exists: boolean }>(withQuery("/api/users/exists", { userId })),
  getDue: (userId: string) => request<DueItem[]>(withQuery("/api/due", { userId })),
  getConfig: (userId: string) => request<Config>(withQuery("/api/config", { userId })),
  addProblem: (userId: string, payload: AddProblemPayload) =>
    request<{ message: string }>("/api/problems", {
      method: "POST",
      body: JSON.stringify({ ...payload, userId })
    }),
  review: (userId: string, problemId: string, quality: 1 | 3 | 5) =>
    request<{ message: string }>("/api/review", {
      method: "POST",
      body: JSON.stringify({ userId, problemId, quality })
    }),
  saveConfig: (userId: string, payload: Config) =>
    request<{ message: string }>("/api/config", {
      method: "POST",
      body: JSON.stringify({ ...payload, userId })
    })
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
