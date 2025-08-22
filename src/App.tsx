import { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";

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
      const res = await fetch(
        "https://0sdq9cvr63.execute-api.us-east-2.amazonaws.com/appointments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const json = await res.json();
      if (!res.ok) setState({ error: json?.error || "Failed to book" });
      else {
        setState({ ok: true, id: json.id });
        setForm({ owner: "", dog: "", date: "", contact: "" });
      }
    } catch (err: any) {
      setState({ error: err?.message || "Network error" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input className="w-full border p-2 rounded" type="text" name="owner" placeholder="Owner Name" value={form.owner} onChange={handleChange} required />
      <input className="w-full border p-2 rounded" type="text" name="dog" placeholder="Dog Name" value={form.dog} onChange={handleChange} required />
      <input className="w-full border p-2 rounded" type="date" name="date" value={form.date} onChange={handleChange} required />
      <input className="w-full border p-2 rounded" type="text" name="contact" placeholder="Phone or Email" value={form.contact} onChange={handleChange} required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Book Appointment</button>
      {state.ok && <p className="text-green-600">✅ Booked! ID: {state.id}</p>}
      {state.error && <p className="text-red-600">❌ {state.error}</p>}
    </form>
  );
}

/* ------------------------------ Pages ------------------------------ */
function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full p-8 rounded-2xl shadow bg-white">
        <h1 className="text-3xl font-bold mb-2">Vet Vax</h1>
        <p className="text-slate-600 mb-4">Mobile dog vaccine booking — coming soon... 2026</p>
        <nav className="flex gap-4">
          <Link to="/" className="underline">Home</Link>
          <Link to="/appointments" className="underline">Appointments</Link>
          <Link to="/queue" className="underline">Queue</Link>
        </nav>
      </div>
    </div>
  );
}

function Appointments() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
        <AppointmentForm />
      </div>
    </div>
  );
}

function Queue() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const API = "https://0sdq9cvr63.execute-api.us-east-2.amazonaws.com";

  async function load() {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch(`${API}/appointments`);
      const ct = res.headers.get("content-type") || "";
      const body = ct.includes("application/json") ? await res.json() : await res.text();
      if (!res.ok) {
        setError(typeof body === "string" ? `HTTP ${res.status}: ${body}` : `HTTP ${res.status}`);
        setItems([]);
      } else {
        setItems(Array.isArray(body) ? body : []);
      }
    } catch (e: any) {
      setError(e?.message || "Network error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Queue</h2>
          <button onClick={load} className="px-3 py-2 rounded bg-blue-600 text-white">
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
        {error && <p className="text-red-600 mb-3">❌ {error}</p>}
        {!error && items.length === 0 && !loading && <p>No appointments yet.</p>}
        {items.length > 0 && (
          <ul className="divide-y">
            {items.map((a: any) => (
              <li key={a.id} className="py-3">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{a.owner} — {a.dog}</div>
                    <div className="text-sm text-slate-600">{a.date} • {a.contact}</div>
                  </div>
                  <div className="text-sm">{a.status}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Router ----------------------------- */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/queue" element={<Queue />} />
    </Routes>
  );
}
