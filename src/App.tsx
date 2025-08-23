import { useEffect, useState } from "react";
import { HashRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";

/** Your API base */
const API = "https://0sdq9cvr63.execute-api.us-east-2.amazonaws.com";

/* ------------------------- Appointment Form ------------------------- */
function AppointmentForm() {
  const [form, setForm] = useState({ owner: "", dog: "", date: "", contact: "" });
  const [state, setState] = useState<{ ok?: boolean; error?: string; id?: string }>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({});
    try {
      const res = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const ct = res.headers.get("content-type") || "";
      const body = ct.includes("application/json") ? await res.json() : await res.text();

      if (!res.ok) throw new Error(typeof body === "string" ? body : `HTTP ${res.status}`);

      setState({ ok: true, id: (body as any).id });
      setForm({ owner: "", dog: "", date: "", contact: "" });
    } catch (err: any) {
      setState({ ok: false, error: err.message || "Network error" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border rounded-lg p-4">
      <h2 className="text-lg font-semibold">Create Appointment</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        <input name="owner" value={form.owner} onChange={handleChange} placeholder="Owner name" className="border p-2 rounded" required />
        <input name="dog" value={form.dog} onChange={handleChange} placeholder="Dog name" className="border p-2 rounded" required />
        <input name="date" value={form.date} onChange={handleChange} placeholder="YYYY-MM-DD" className="border p-2 rounded" required />
        <input name="contact" value={form.contact} onChange={handleChange} placeholder="email or phone" className="border p-2 rounded" required />
      </div>
      <button className="px-3 py-2 bg-blue-600 text-white rounded">Submit</button>
      {state.ok && <div className="text-green-700">Saved! ID: {state.id}</div>}
      {state.error && <div className="text-red-600">Error: {state.error}</div>}
    </form>
  );
}

/* --------------------------- Appointments --------------------------- */
function Appointments() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch(`${API}/appointments`, { headers: { "Content-Type": "application/json" } });
      const ct = res.headers.get("content-type") || "";
      const body = ct.includes("application/json") ? await res.json() : await res.text();
      if (!res.ok) throw new Error(typeof body === "string" ? body : `HTTP ${res.status}`);
      setItems(Array.isArray(body) ? body : []);
    } catch (e: any) {
      setError(e.message || "Network error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Appointments</h1>
      <AppointmentForm />
      <div className="flex items-center gap-3">
        <button onClick={load} className="px-3 py-1 bg-blue-500 text-white rounded">Refresh</button>
        <span className="text-sm opacity-70">Total: {items.length}</span>
      </div>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {items.length === 0 ? (
        <div>No appointments yet.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <li key={a.id} className="border rounded p-3">
              <div className="font-medium">{a.dog} — {a.owner}</div>
              <div className="text-sm opacity-80">{new Date(a.date || a.createdAt).toLocaleString()}</div>
              <div className="text-sm">{a.contact}</div>
              <div className="text-xs uppercase opacity-70">{a.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* --------------------------------- Queue ----------------------------- */
function Queue() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError(undefined);
    try {
      // Call the same endpoint as Appointments (no query string)
      const res = await fetch(`${API}/appointments`, {
        headers: { "Content-Type": "application/json" },
      });

      const ct = res.headers.get("content-type") || "";
      const body = ct.includes("application/json") ? await res.json() : await res.text();

      if (!res.ok) {
        throw new Error(typeof body === "string" ? body : `HTTP ${res.status}`);
      }

      // 🔑 Filter client-side for status NEW (case-insensitive)
      const all = Array.isArray(body) ? body : [];
      const onlyNew = all.filter(
        (i) => String(i?.status ?? "").toUpperCase() === "NEW"
      );

      setItems(onlyNew);
    } catch (e: any) {
      setError(e.message || "Network error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Queue</h1>
      <button onClick={load} className="px-3 py-1 bg-blue-500 text-white rounded">Refresh</button>
      <div className="text-sm opacity-70">Items in queue: {items.length}</div>
      {loading && <div>Loading queue…</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {items.length === 0 ? (
        <div>No appointments yet.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <li key={a.id} className="border rounded p-3">
              <div className="font-medium">{a.dog} — {a.owner}</div>
              <div className="text-sm opacity-80">
                {new Date(a.date || a.createdAt).toLocaleString()}
              </div>
              <div className="text-sm">{a.contact}</div>
              <div className="text-xs uppercase opacity-70">{a.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
/* --------------------------------- App -------------------------------- */
export default function App() {
  return (
    <HashRouter>
      <div className="p-4 max-w-3xl mx-auto space-y-6">
        <nav className="flex gap-3 pb-3 border-b">
          <Link to="/appointments" className="text-blue-600 hover:underline">Appointments</Link>
          <Link to="/queue" className="text-blue-600 hover:underline">Queue</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/appointments" replace />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </div>
    </HashRouter>
  );
}
