import Head from "next/head";
import { AuctionContextProvider } from "../lib/context/auction";
import prisma from "../lib/prisma";

import { useStoryblokState, StoryblokComponent } from "@storyblok/react";
import storyblok from "../lib/storyblok";
import useSWR, { SWRConfig } from "swr";

function PageInner({ story, auctionItem }) {
  story = useStoryblokState(story);

  const { data } = useSWR(
    () => `/api/storyblok/auction-item/${auctionItem.storyblokUuid}`
  );

  if (!data) {
    return null;
  }

  return (
    <AuctionContextProvider value={data}>
      <StoryblokComponent story={story} blok={story.content} pledges={[]} />
    </AuctionContextProvider>
  );
}

export default function Page({ fallback, ...rest }) {
  return (
    <SWRConfig value={{ fallback }}>
      <PageInner {...rest} />
    </SWRConfig>
  );
}

export async function getStaticProps({ params }) {
  let slug = params.slug ? params.slug.join("/") : "home";

  const fallback = {};

  const { data } = await storyblok.get(`cdn/stories/${slug}`, {
    version: "published",
    cv: new Date().valueOf(), // Cache invalidation
    resolve_relations: "auction.artist",
  });

  const story = data ? data.story : false;
  const key = story ? story.id : false;

  const auctionItem = story
    ? await getAuctionItemByStoryblokUuid(story.uuid)
    : null;

  if (auctionItem) {
    fallback[`/api/storyblok/auction-item/${auctionItem.storyblokUuid}`] =
      auctionItem;
  }

  return {
    props: {
      story,
      auctionItem,
      key,
      fallback,
    },
    revalidate: 60 * 5, // Revalidate every 5 minutes
  };
}

async function getAuctionItemByStoryblokUuid(storyblokUuid) {
  const item = await prisma.auctionItem.findUnique({
    where: { storyblokUuid },
    include: {
      bids: {
        select: { id: true, amount: true, createdAt: true },
        orderBy: { amount: "desc" },
      },
    },
  });

  if (!item) {
    return null;
  }

  return {
    ...item,
    closesAt: item.closesAt.toISOString(), // Date times can't be serialised
    bids: (item.bids ?? []).map((bid) => ({
      ...bid,
      createdAt: bid.createdAt.toISOString(), // Date times can't be serialised
    })),
  };
}

export async function getStaticPaths() {
  // Only generate pages for auctions
  let { data } = await storyblok.get("cdn/links/?starts_with=auctions/", {
    cv: new Date().valueOf(), // Cache invalidation
    per_page: 100,
  });

  let paths = [];
  Object.keys(data.links).forEach((linkKey) => {
    if (data.links[linkKey].is_folder || data.links[linkKey].slug === "home") {
      return;
    }

    const slug = data.links[linkKey].slug;
    let splittedSlug = slug.split("/");

    paths.push({ params: { slug: splittedSlug } });
  });

  return {
    paths: paths,
    fallback: false,
  };
}
