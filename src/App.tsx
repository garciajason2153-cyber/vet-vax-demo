import { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";

/* ------------------------- Appointment Form ------------------------- */
function AppointmentForm() {
  const [form, setForm] = useState({
    owner: "",
    dog: "",
    date: "",
    contact: "",
  });
  const [state, setState] = useState<{ ok?: boolean; error?: string; id?: string }>(
    {}
  );

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
      if (!res.ok) {
        setState({ error: json?.error || "Failed to book" });
      } else {
        setState({ ok: true, id: json.id });
        setForm({ owner: "", dog: "", date: "", contact: "" });
      }
    } catch (err: any) {
      setState({ error: err?.message || "Network error" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        type="text"
        name="owner"
        placeholder="Owner Name"
        value={form.owner}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        name="dog"
        placeholder="Dog Name"
        value={form.dog}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        name="contact"
        placeholder="Phone or Email"
        value={form.contact}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Book Appointment
      </button>

      {state.ok && (
        <p className="text-green-600">✅ Booked! ID: {state.id}</p>
      )}
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
        <p className="text-slate-600 mb-4">
          Mobile dog vaccine booking — coming soon... 2026
        </p>
        <nav className="flex gap-4">
          <Link to="/" className="underline">
            Home
          </Link>
          <Link to="/appointments" className="underline">
            Appointments
          </Link>
          <Link to="/queue" className="underline">
            Queue
          </Link>
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
  const [items, setItems] = useState<any[]>([])
  const [error, setError] = useState<string | undefined>()

  async function load() {
    setError(undefined)
    try {
      const res = await fetch("https://0sdq9cvr63.execute-api.us-east-2.amazonaws.com/appointments")
      const json = await res.json()
      if (!res.ok) setError(json?.error || `HTTP ${res.status}`)
      else setItems(json)
    } catch (e:any) {
      setError(e?.message || "Network error")
    }
  }

  // load on first render
  useState(() => { load() })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Queue</h2>
          <button onClick={load} className="px-3 py-2 rounded bg-blue-600 text-white">Refresh</button>
        </div>
        {error && <p className="text-red-600 mb-3">❌ {error}</p>}
        {items.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          <ul className="divide-y">
            {items.map((a) => (
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
  )
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
