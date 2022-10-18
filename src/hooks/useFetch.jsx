import { useEffect, useState } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    setTimeout(() => {
      fetch(url, { signal: abortController.signal })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }

          throw new Error(`${res.status}: ${res.statusText}`);
        })
        .then((data) => {
          setData(data);
          setError(null);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        });
    }, 1000);

    return () => abortController.abort();
  }, []);

  return { data, error };
}
