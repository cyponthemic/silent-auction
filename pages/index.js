import Head from "next/head";
import styles from "../styles/Home.module.css";

import {
  useStoryblokState,
  getStoryblokApi,
  StoryblokComponent,
} from "@storyblok/react";
import AppContext from "../context/AppContext";
import { useContext } from "react";
export default function Home({ story, auctions }) {
  story = useStoryblokState(story);
  auctions = useStoryblokState(auctions);

  const { setAuctions } = useContext(AppContext);
  setAuctions(auctions);

  return (
    <div className={styles.container}>
      <StoryblokComponent blok={story.content} auctions={auctions} />
    </div>
  );
}

export async function getStaticProps() {
  let slug = "home";

  let sbParams = {
    version: "draft", // or 'published'
  };

  const storyblokApi = getStoryblokApi();
  let { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

  let { data: auctions } = await storyblokApi.get(`cdn/stories/`, {
    starts_with: "auctions/",
    resolve_relations: "auction.artist",
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
