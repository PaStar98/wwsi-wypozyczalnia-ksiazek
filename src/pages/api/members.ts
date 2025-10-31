import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const members = await prisma.member.findMany();
    return res.json(members);
  }

  if (req.method === "POST") {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "name and email required" });

    try {
      const m = await prisma.member.create({ data: { name, email } });
      return res
        .status(201)
        .setHeader("Location", `/api/members/${m.id}`)
        .json(m);
    } catch (e: any) {
      if (e.code === "P2002")
        return res.status(409).json({ error: "email already exists" });
      return res.status(500).json({ error: "server error" });
    }
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
