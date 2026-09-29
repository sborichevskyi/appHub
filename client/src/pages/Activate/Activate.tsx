import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const Activate = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const requestedToken = useRef<string | null>(null);

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      return;
    }

    // StrictMode runs effects twice in dev; the token is single-use
    if (requestedToken.current === token) return;
    requestedToken.current = token;

    fetch(`${import.meta.env.VITE_API_URL}/auth/activate?token=${token}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
  }, [token]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        // Full reload so App re-runs the refresh query with the new cookies
        window.location.assign("/profile");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  if (status === "loading") return <h1>Activating...</h1>;
  if (status === "success") return <h1>✅ Account activated</h1>;
  if (status === "error") return <h1>❌ Activation failed</h1>;
};
