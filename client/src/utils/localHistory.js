const KEY = 'filmyaf_local_history_v1';

export const loadLocal = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

export const saveLocal = (arr) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 25)));
  } catch {
    // quota exceeded — drop oldest by saving smaller slice
    try {
      localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 10)));
    } catch {
      /* ignore */
    }
  }
};

export const clearLocal = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
};
