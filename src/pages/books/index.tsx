import React, { useEffect, useState } from "react";

type Book = {
  id: number;
  title: string;
  author: string;
  copies: number;
  available: number;
};
type Member = { id: number; name: string };

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  async function load() {
    const [booksRes, membersRes] = await Promise.all([
      fetch("/api/books"),
      fetch("/api/members"),
    ]);
    setBooks(await booksRes.json());
    setMembers(await membersRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function borrow(bookId: number) {
    const memberId = prompt(
      `Podaj ID członka:\n${members.map((m) => `${m.id}: ${m.name}`).join("\n")}`,
    );
    if (!memberId) return;
    const res = await fetch("/api/loans?action=borrow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ member_id: Number(memberId), book_id: bookId }),
    });
    if (res.status === 201) {
      alert("Wypożyczono!");
      load();
    } else {
      const e = await res.json();
      alert("Błąd: " + (e?.error || res.status));
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Książki</h1>
      <nav>
        <a href="/books/new">➕ Dodaj książkę</a> |{" "}
        <a href="/members">👥 Czytelnicy</a> |{" "}
        <a href="/loans">📚 Wypożyczenia</a>
      </nav>
      <table style={{ width: "100%", marginTop: 10 }} border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tytuł</th>
            <th>Autor</th>
            <th>Egz.</th>
            <th>Dostępne</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.copies}</td>
              <td>{b.available}</td>
              <td>
                <button
                  onClick={() => borrow(b.id)}
                  disabled={b.available <= 0}
                >
                  Wypożycz
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
