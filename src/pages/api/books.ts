import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const books = await prisma.book.findMany({ include: { loans: true } });
    const mapped = books.map((b) => {
      const activeLoans = b.loans.filter((l) => l.returnDate === null).length;
      return {
        id: b.id,
        title: b.title,
        author: b.author,
        copies: b.copies,
        available: b.copies - activeLoans,
      };
    });
    return res.json(mapped);
  }

  if (req.method === "POST") {
    const { title, author, copies } = req.body;
    if (!title || !author)
      return res.status(400).json({ error: "title and author required" });
    const c = Number(copies ?? 1);
    const book = await prisma.book.create({
      data: { title, author, copies: c },
    });
    return res.status(201).json(book);
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
