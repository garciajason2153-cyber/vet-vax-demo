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
          Mobile dog vaccine booking — coming soon.
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
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">Queue</h2>
        <p>Queue view coming soon.</p>
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
