import { useState } from "react";
import { useRouter } from "next/router";

export default function NewMember() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (res.status === 201) router.push("/members");
    else {
      const data = await res.json();
      setError(data.error || "Błąd");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Nowy czytelnik</h1>
      <form onSubmit={submit}>
        <p>
          <label>
            Imię:{" "}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </p>
        <p>
          <label>
            Email:{" "}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Zapisz</button>
      </form>
    </div>
  );
}
