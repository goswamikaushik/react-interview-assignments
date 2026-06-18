import { useEffect, useState } from "react";

const useDebounce = (query: string, delay: number = 300) => {
  const [debounceText, setDebounceText] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebounceText(query), delay);
    return () => clearTimeout(timer);
  }, [query, delay]);

  return debounceText;
};

export default useDebounce;
