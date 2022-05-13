import Head from "next/head";
import styles from "../styles/Home.module.css";

import {
  useStoryblokState,
  getStoryblokApi,
  StoryblokComponent,
} from "@storyblok/react";

export default function Page({ story, pledges }) {
  story = useStoryblokState(story);
  pledges = useStoryblokState(pledges);
  return (
    <div className={styles.container}>
      <StoryblokComponent story={story} blok={story.content} pledges={pledges} />
    </div>
  );
}

export async function getStaticProps({ params }) {
  let slug = params.slug ? params.slug.join("/") : "home";

  let sbParams = {
    version: "draft", // or 'published'
  };

  const storyblokApi = getStoryblokApi();
  let { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

  console.log( data.story.uuid)
  let { data: pledges } = await storyblokApi.get(`cdn/stories/`, {
    starts_with: "pledges/",
    per_page: 3,
    filter_query: {
      auction: {
        in: data.story.uuid,
      },
    },
  });

  return {
    props: {
      story: data ? data.story : false,
      pledges: pledges?.stories || [],
      key: data ? data.story.id : false,
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
