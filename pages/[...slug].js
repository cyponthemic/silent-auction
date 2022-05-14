import Head from "next/head";
import styles from "../styles/Home.module.css";
import { AuctionContextProvider } from "../lib/context/auction";
import prisma from "../lib/prisma";

import {
  useStoryblokState,
  getStoryblokApi,
  StoryblokComponent,
} from "@storyblok/react";

export default function Page({ story, pledges, bids }) {
  story = useStoryblokState(story);

  const auctionContext = {
    auctionId: story.id,
    bids,
  };

  return (
    <AuctionContextProvider value={auctionContext}>
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

  const bids = key
    ? await prisma.bid.findMany({
        select: { amount: true },
        where: { auctionItemId: String(key) },
      })
    : [];

  return {
    props: {
      story: data ? data.story : false,
      bids: bids || [],
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
