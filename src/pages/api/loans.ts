import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const loans = await prisma.loan.findMany({
      include: { member: true, book: true },
      orderBy: { loanDate: "desc" },
    });
    return res.json(loans);
  }

  // Borrow
  if (req.method === "POST") {
    const { action } = req.query;

    if (action === "borrow") {
      const { member_id, book_id, days } = req.body;
      if (!member_id || !book_id)
        return res
          .status(400)
          .json({ error: "member_id and book_id required" });

      // check copies available
      const book = await prisma.book.findUnique({
        where: { id: Number(book_id) },
        include: { loans: true },
      });
      if (!book) return res.status(404).json({ error: "book not found" });

      const active = book.loans.filter((l) => l.returnDate === null).length;
      if (active >= book.copies)
        return res.status(409).json({ error: "no copies available" });

      const now = new Date();
      const due = new Date(now);
      due.setDate(due.getDate() + Number(days ?? 14));

      const loan = await prisma.loan.create({
        data: {
          memberId: Number(member_id),
          bookId: Number(book_id),
          loanDate: now,
          dueDate: due,
        },
      });

      return res.status(201).json(loan);
    }

    if (action === "return") {
      const { loan_id } = req.body;
      if (!loan_id) return res.status(400).json({ error: "loan_id required" });

      const loan = await prisma.loan.findUnique({
        where: { id: Number(loan_id) },
      });
      if (!loan) return res.status(404).json({ error: "loan not found" });
      if (loan.returnDate !== null)
        return res.status(409).json({ error: "already returned" });

      const returned = await prisma.loan.update({
        where: { id: Number(loan_id) },
        data: { returnDate: new Date() },
      });
      return res.status(200).json(returned);
    }

    return res.status(400).json({ error: "unknown action" });
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
