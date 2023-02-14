import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loader from "components/Loader/Loader";
import { authContext } from "contexts/auth";
import "./OauthGoogle.scss";

const EXPECTED_SEARCH_PARAMS = ["code"];

export default function OauthGoogle() {
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const { setCurrentUser } = useContext(authContext);

  useEffect(() => {
    const abortController = new AbortController();

    for (const param of EXPECTED_SEARCH_PARAMS) {
      if (!searchParams.has(param)) {
        setError("some error occured");
        return () => abortController.abort();
      }
    }

    (async function () {
      try {
        const res = await axios.post(`/oauth/google/?${searchParams.toString()}`, null, {
          signal: abortController.signal,
        });
        setCurrentUser(res.data.data);
        localStorage.setItem("token", res.data.token);
      } catch (err) {
        console.error(err);
        if (err.response) {
          setError(err.response.data.error);
        } else if (err.name !== "CanceledError") {
          setError(err.message);
        }
      }
    })();

    return () => abortController.abort();
  }, []);

  let content;
  if (error) {
    content = <div className="error-msg">{error}</div>;
  } else {
    content = <Loader />;
  }

  return (
    <div className="page" id="oauth-google-page">
      {content}
    </div>
  );
}
