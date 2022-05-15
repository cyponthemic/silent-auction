export async function getAuctionItemByStoryblokUuid(prisma, storyblokUuid) {
  const item = await prisma.auctionItem.findUnique({
    where: { storyblokUuid },
    include: {
      bids: {
        select: { amount: true, createdAt: true },
        orderBy: { amount: "desc" },
        take: 3,
      },
    },
  });

  return {
    ...item,
    bids: (item.bids ?? []).map((bid) => ({
      ...bid,
      createdAt: bid.createdAt.toISOString(), // Date times can't be serialised
    })),
  };
}
