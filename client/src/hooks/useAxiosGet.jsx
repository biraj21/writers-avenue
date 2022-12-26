import axios from "axios";
import { useEffect, useState } from "react";

export function useAxiosGet(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    axios
      .get(url, { signal: abortController.signal })
      .then((res) => {
        setData(res.data.data);
        setError(null);
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.error);
        }
      });

    return () => abortController.abort();
  }, [url]);

  return { data, setData, error, setError };
}
