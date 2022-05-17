import Head from "next/head";
import { AuctionContextProvider } from "../lib/context/auction";
import prisma from "../lib/prisma";

import { useStoryblokState, StoryblokComponent } from "@storyblok/react";
import { getAuctionItemByStoryblokUuid } from "../lib/services/auction-item";
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

  let sbParams = {
    version: "draft", // or 'published'
  };

  const fallback = {};

  const { data } = await storyblok.get(`cdn/stories/${slug}`, sbParams);

  const story = data ? data.story : false;
  const key = story ? story.id : false;

  const auctionItem = story
    ? await getAuctionItemByStoryblokUuid(prisma, story.uuid)
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

export async function getStaticPaths() {
  // Only generate pages for auctions
  let { data } = await storyblok.get("cdn/links/?starts_with=auctions/");

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
