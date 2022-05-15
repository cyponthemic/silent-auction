import Head from "next/head";
import { AuctionContextProvider } from "../lib/context/auction";
import prisma from "../lib/prisma";

import {
  useStoryblokState,
  getStoryblokApi,
  StoryblokComponent,
} from "@storyblok/react";
import { getAuctionItemByStoryblokUuid } from "../lib/services/auction-item";

export default function Page({ story, auctionItem }) {
  story = useStoryblokState(story);

  return (
    <AuctionContextProvider value={auctionItem}>
      <StoryblokComponent story={story} blok={story.content} pledges={[]} />
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
    ? await getAuctionItemByStoryblokUuid(prisma, story.uuid)
    : null;

  return {
    props: {
      story: data ? data.story : false,
      auctionItem,
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
