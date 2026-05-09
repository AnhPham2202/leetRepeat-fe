const LOCAL_STORAGE_USER_ID_KEY = "leetRepeatUserId";

function buildGuestUserId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `guest-${crypto.randomUUID().slice(0, 8)}`;
  }

  return `guest-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateUserId(): string {
  const existing = localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY)?.trim();
  if (existing) {
    return existing;
  }

  const next = buildGuestUserId();
  localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, next);
  return next;
}

export function saveUserId(userId: string): void {
  localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, userId.trim());
}
