import Head from "next/head";

import { useStoryblokState, StoryblokComponent } from "@storyblok/react";
import { AuctionsContextProvider } from "../context/AuctionsContext";
import storyblok from "../lib/storyblok";

export default function Home({ story, auctions }) {
  story = useStoryblokState(story);
  auctions = useStoryblokState(auctions);

  return (
    <AuctionsContextProvider value={{ auctions }}>
      <StoryblokComponent blok={story.content} auctions={auctions} />
    </AuctionsContextProvider>
  );
}

export async function getStaticProps() {
  let slug = "home";

  // Cache invalidation
  const ci = new Date().valueOf();

  let { data } = await storyblok.get(`cdn/stories/${slug}`, {
    ci,
  });

  let { data: auctions } = await storyblok.get(`cdn/stories/`, {
    starts_with: "auctions/",
    ci, // Add cache invalidation
    // resolve_relations: "auction.artist",
  });

  return {
    props: {
      story: data ? data.story : false,
      auctions: auctions?.stories || [],
      key: data ? data.story.id : false,
    },
    revalidate: 60 * 30, // Revalidate every 30 minutes
  };
}
