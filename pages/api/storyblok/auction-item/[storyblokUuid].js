import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    query: { storyblokUuid },
  } = req;

  const item = await prisma.auctionItem.findUnique({
    where: { storyblokUuid },
    include: {
      bids: {
        select: { id: true, amount: true, createdAt: true },
        orderBy: { amount: "desc" },
        take: 5,
      },
    },
  });

  return res.status(200).json(
    item
      ? {
          ...item,
          bids: (item.bids ?? []).map((bid) => ({
            ...bid,
            createdAt: bid.createdAt.toISOString(), // Date times can't be serialised
          })),
        }
      : null
  );
}
