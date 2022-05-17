import StoryblokClient from "storyblok-js-client";

const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_FRONTEND_TOKEN,
  // oauthToken: process.env.STORYBLOK_BACKEND_TOKEN,
  cache: {
    clear: "auto",
    type: "none",
  },
});

export default Storyblok;
