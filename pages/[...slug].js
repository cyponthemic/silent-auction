import Head from "next/head";
import styles from "../styles/Home.module.css";
import { AuctionContextProvider } from "../lib/context/auction";
import prisma from "../lib/prisma";

import {
  useStoryblokState,
  getStoryblokApi,
  StoryblokComponent,
} from "@storyblok/react";

export default function Page({ story, auctionItem }) {
  story = useStoryblokState(story);

  return (
    <AuctionContextProvider value={auctionItem}>
      <div className={styles.container}>
        <StoryblokComponent story={story} blok={story.content} pledges={[]} />
      </div>
    </AuctionContextProvider>
  );
}

export async function getStaticProps({ params }) {
  let slug = params.slug ? params.slug.join("/") : "home";

  let sbParams = {
    version: "draft", // or 'published'
  };

  const storyblokApi = getStoryblokApi();
  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

  const story = data ? data.story : false;
  const key = story ? story.id : false;

  const auctionItem = story
    ? await prisma.auctionItem.findUnique({
        where: { storyblokUuid: story.uuid },
        include: {
          bids: {
            orderBy: { amount: "desc" },
            take: 3,
          },
        },
      })
    : null;

  const transformedAuctionItem = {
    ...auctionItem,
    bids: (auctionItem.bids ?? []).map((bid) => ({
      ...bid,
      createdAt: bid.createdAt.valueOf(), // Date times can't be serialised
    })),
  };

  return {
    props: {
      story: data ? data.story : false,
      auctionItem: transformedAuctionItem,
      key,
    },
    revalidate: 3600,
  };
}

export async function getStaticPaths() {
  const storyblokApi = getStoryblokApi();
  let { data } = await storyblokApi.get("cdn/links/");

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
