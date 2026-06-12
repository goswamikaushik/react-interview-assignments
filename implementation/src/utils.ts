type Key = "cart-state" | "bookmarks";

export const localStorageAction = () => {
  const set = (key: Key, value: string) => localStorage.setItem(key, value);
  const get = (key: Key) => localStorage.getItem(key);
  const clear = () => localStorage.clear();
  const remove = (key: Key) => localStorage.removeItem(key);

  return { set, get, clear, remove };
};
