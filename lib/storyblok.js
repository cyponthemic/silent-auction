import StoryblokClient from "storyblok-js-client";

const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_BACKEND_TOKEN,
});

export default Storyblok;
