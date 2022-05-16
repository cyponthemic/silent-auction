import Head from "next/head";

import { useStoryblokState, StoryblokComponent } from "@storyblok/react";
import AppContext from "../context/AppContext";
import { useContext } from "react";
import storyblok from "../lib/storyblok";

export default function Home({ story, auctions }) {
  story = useStoryblokState(story);
  auctions = useStoryblokState(auctions);

  const { setAuctions } = useContext(AppContext);
  setAuctions(auctions);

  return <StoryblokComponent blok={story.content} auctions={auctions} />;
}

export async function getStaticProps() {
  let slug = "home";

  let sbParams = {
    version: "draft", // or 'published'
  };

  let { data } = await storyblok.get(`cdn/stories/${slug}`, sbParams);

  let { data: auctions } = await storyblok.get(`cdn/stories/`, {
    starts_with: "auctions/",
    // resolve_relations: "auction.artist",
  });

  return {
    props: {
      story: data ? data.story : false,
      auctions: auctions?.stories || [],
      key: data ? data.story.id : false,
    },
    revalidate: 3600,
  };
}
