import { useEffect, useState } from "react";

const KEY = "dh-badges-v1";

function read(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function write(data: Record<string, number>) {
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("dh-progress"));
}

export function awardBadge(lessonId: string, score: number) {
  const data = read();
  data[lessonId] = Math.max(data[lessonId] ?? 0, score);
  write(data);
}

export function resetProgress() {
  write({});
}

export function useProgress() {
  const [data, setData] = useState<Record<string, number>>({});
  useEffect(() => {
    const sync = () => setData(read());
    sync();
    window.addEventListener("dh-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("dh-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return data;
}