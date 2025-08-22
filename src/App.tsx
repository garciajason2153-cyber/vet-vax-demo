import { Link, Routes, Route } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full p-8 rounded-2xl shadow bg-white">
        <h1 className="text-3xl font-bold mb-2">Vet Vax</h1>
        <p className="text-slate-600 mb-4">
          Mobile dog vaccine booking — coming soon.
        </p>
        <nav className="flex gap-4">
          <Link to="/" className="underline">Home</Link>
          <Link to="/appointments" className="underline">Appointments</Link>
          <Link to="/queue" className="underline">Queue</Link>
        </nav>
      </div>
    </div>
  )
}

function Appointments() {
  return <div style={{ padding: 24 }}>📅 Appointments page</div>
}

function Queue() {
  return <div style={{ padding: 24 }}>⏳ Queue page</div>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/queue" element={<Queue />} />
    </Routes>
  )
}
