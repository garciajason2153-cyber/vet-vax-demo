import { useEffect, useState } from "react";

function Queue() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const API = "https://0sdq9cvr63.execute-api.us-east-2.amazonaws.com";

  async function load() {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch(`${API}/appointments?status=NEW`, {
        headers: { "Content-Type": "application/json" },
      });

      const ct = res.headers.get("content-type") || "";
      const body = ct.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        throw new Error(
          typeof body === "string" ? body : `HTTP ${res.status}`
        );
      }

      console.log("Queue payload:", body);
      setItems(Array.isArray(body) ? body : []);
    } catch (e: any) {
      setError(e.message || "Network error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // load on mount
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">Queue</h1>
      <button
        onClick={load}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        Refresh
      </button>

      {loading && <div>Loading queue…</div>}
      {error && <div className="text-red-600">Error: {error}</div>}

      {!loading && !error && (
        <>
          <div className="text-sm opacity-70">
            Items in queue: {items.length}
          </div>

          {items.length === 0 ? (
            <div>No appointments yet.</div>
          ) : (
            <ul className="space-y-2">
              {items.map((a) => (
                <li key={a.id} className="border rounded-lg p-3">
                  <div className="font-medium">
                    {a.dog} — {a.owner}
                  </div>
                  <div className="text-sm opacity-80">
                    {new Date(a.date || a.createdAt).toLocaleString()}
                  </div>
                  <div className="text-sm">{a.contact}</div>
                  <div className="text-xs uppercase tracking-wide opacity-70">
                    {a.status}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default Queue;
