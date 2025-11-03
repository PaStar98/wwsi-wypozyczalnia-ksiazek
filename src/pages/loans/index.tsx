import Link from "next/link";
import { useEffect, useState } from "react";

type Loan = {
  id: number;
  member: { name: string };
  book: { title: string };
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
};

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);

  async function load() {
    const res = await fetch("/api/loans");
    setLoans(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function returnLoan(id: number) {
    const res = await fetch("/api/loans?action=return", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loan_id: id }),
    });
    if (res.ok) {
      alert("Zwrócono");
      load();
    } else {
      const e = await res.json();
      alert("Błąd: " + (e.error || res.status));
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Wypożyczenia</h1>
      <nav>
        <Link href="/books">📚 Książki</Link> |{" "}
        <Link href="/members">👥 Czytelnicy</Link>
      </nav>
      <table border={1} style={{ marginTop: 10, width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Czytelnik</th>
            <th>Książka</th>
            <th>Od</th>
            <th>Do</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loans.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.member.name}</td>
              <td>{l.book.title}</td>
              <td>{new Date(l.loanDate).toLocaleDateString()}</td>
              <td>{new Date(l.dueDate).toLocaleDateString()}</td>
              <td>{l.returnDate ? "Zwrócono" : "Aktywne"}</td>
              <td>
                {!l.returnDate && (
                  <button onClick={() => returnLoan(l.id)}>Zwróć</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
