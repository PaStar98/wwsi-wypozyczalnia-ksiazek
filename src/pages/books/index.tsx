import Link from "next/link";
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Książki</h1>
        <Link
          href="/books/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          ➕ Dodaj książkę
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tytuł</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Egz.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dostępne</th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Akcje</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{b.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.copies}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${b.available > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {b.available}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => borrow(b.id)}
                    disabled={b.available <= 0}
                    className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Wypożycz
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
