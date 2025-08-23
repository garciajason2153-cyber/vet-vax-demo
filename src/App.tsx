import { useEffect, useState } from "react";
import "./App.css";

const API = "https://0sdq9cvr63.execute-api.us-east-2.amazonaws.com";

export default function App() {
  const [ok, setOk] = useState("…");

  useEffect(() => {
    // tiny ping to prove JS is executing
    setOk("App is running");
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Vet Vax Demo</h1>
      <p>{ok}</p>
      <p className="text-sm opacity-70">
        If you can read this, the white screen was caused by routing or another component.
      </p>
    </div>
  );
}
