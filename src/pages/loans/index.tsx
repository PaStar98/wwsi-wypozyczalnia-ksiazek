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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Wypożyczenia</h1>
        <div className="flex space-x-4">
          {/* Add actions here if needed */}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Czytelnik</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Książka</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Od</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Do</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Akcje</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{l.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{l.member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{l.book.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(l.loanDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(l.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${l.returnDate ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {l.returnDate ? "Zwrócono" : "Aktywne"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {!l.returnDate && (
                    <button onClick={() => returnLoan(l.id)} className="text-blue-600 hover:text-blue-900">Zwróć</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
