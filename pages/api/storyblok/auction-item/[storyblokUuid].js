import prisma from "../../../../lib/prisma";
import { getAuctionItemByStoryblokUuid } from "../../../../lib/services/auction-item";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    query: { storyblokUuid },
  } = req;

  const auctionItem = await getAuctionItemByStoryblokUuid(
    prisma,
    storyblokUuid
  );

  res.status(200).json(auctionItem);
}
