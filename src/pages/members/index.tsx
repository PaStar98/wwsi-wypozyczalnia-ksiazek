import Link from "next/link";
import { useEffect, useState } from "react";

type Member = { id: number; name: string; email: string };

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);

  async function load() {
    const res = await fetch("/api/members");
    setMembers(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Czytelnicy</h1>
      <nav>
        <Link href="/books">📚 Książki</Link> |{" "}
        <Link href="/members/new">➕ Dodaj czytelnika</Link>
      </nav>
      <table border={1} style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Imię</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>{m.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
