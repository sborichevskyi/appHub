import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const Activate = () => {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/auth/activate?token=${token}`)
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

  if (status === "loading") return <h1>Activating...</h1>;
  if (status === "success") return <h1>✅ Account activated</h1>;
  if (status === "error") return <h1>❌ Activation failed</h1>;
};