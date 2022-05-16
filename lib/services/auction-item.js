export async function getAuctionItemByStoryblokUuid(prisma, storyblokUuid) {
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

  if (!item) {
    return null;
  }

  return {
    ...item,
    bids: (item.bids ?? []).map((bid) => ({
      ...bid,
      createdAt: bid.createdAt.toISOString(), // Date times can't be serialised
    })),
  };
}
