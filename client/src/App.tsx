import { useState } from "react";
import MatchTester from "./components/MatchTester";
import TokenHelp from "./components/TokenHelp";

type Mode = "beginner" | "advanced";

export default function App() {
  const [regex, setRegex] = useState("(ab|cd)+\\d{2,}");
  const [flags, setFlags] = useState("i");
  const [mode, setMode] = useState<Mode>("beginner");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  /**
   * Calls the API to explain the regex
   * Escape HTML special characters to prevent XSS
   * @param e form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    /**
     * Call the /api/explain endpoint with regex, flags, and mode
     * If successful, setResult with the response JSON
     * If error, setError with the error message
     */
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regex, flags, mode }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Request failed");
      }
      setResult(await res.json());
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main style={{ maxWidth: 800, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Explain My Regex</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <label>
          Regex
          <input value={regex} onChange={(e) => setRegex(e.target.value)} style={{ width: "100%" }} />
        </label>
        <label>
          Flags
          <input value={flags} onChange={(e) => setFlags(e.target.value)} />
        </label>
        <label>
          Mode
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="beginner">Beginner</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <button type="submit">Explain</button>
      </form>
    
      <MatchTester pattern={regex} flags={flags} />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Summary</h2>
          <p>{result.summary}</p>
          <h3>Steps</h3>
          <ul>{result.steps.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
        </div>
      )}

      <TokenHelp pattern={regex} />
    </main>
  );
}
