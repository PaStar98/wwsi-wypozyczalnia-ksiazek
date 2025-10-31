import { useState } from "react";
import { useRouter } from "next/router";

export default function NewBook() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [copies, setCopies] = useState(1);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author, copies }),
    });
    if (res.ok) router.push("/books");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Nowa książka</h1>
      <form onSubmit={submit}>
        <p>
          <label>
            Tytuł:{" "}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        </p>
        <p>
          <label>
            Autor:{" "}
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </label>
        </p>
        <p>
          <label>
            Ilość egzemplarzy:{" "}
            <input
              type="number"
              value={copies}
              onChange={(e) => setCopies(Number(e.target.value))}
              min={1}
            />
          </label>
        </p>
        <button type="submit">Zapisz</button>
      </form>
    </div>
  );
}
