export const getLocalStorage = (storageKey: string): string | null => {
  return window.localStorage.getItem(storageKey);
};
