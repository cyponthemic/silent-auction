import storyblok from "../../../lib/storyblok";
import prisma from "../../../lib/prisma";

const auctionFolderId = "132704142";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (req.query?.token !== process.env.SYNC_SECRET) {
    return res.status(401).end(`Unauthorised`);
  }

  const stories = await storyblok.get("spaces/156827/stories/", {
    is_published: true,
    with_parent: auctionFolderId,
    per_page: 100,
  });

  const auctionItems = stories.data.stories.map((story) => ({
    storyblokUuid: story.uuid,
    name: story.name,
  }));

  await prisma.$transaction([
    prisma.auctionItem.deleteMany(),
    prisma.auctionItem.createMany({
      data: auctionItems,
    }),
  ]);

  return res.status(200).json(`${auctionItems.length} items imported`);
}
