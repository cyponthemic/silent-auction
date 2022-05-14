import "../styles/globals.css";
import { storyblokInit, apiPlugin } from "@storyblok/react";


import Feature from "../components/Feature";
import Grid from "../components/Grid";
import Page from "../components/Page";
import Teaser from "../components/Teaser";
import Auction from "../components/Auction";
import AuctionListing from "../components/AuctionListing";

const components = {
  feature: Feature,
  grid: Grid,
  teaser: Teaser,
  page: Page,
  auction: Auction,
  AuctionListing
};

storyblokInit({
  accessToken: process.env.STORYBLOK_FRONTEND_TOKEN,
  use: [apiPlugin],
  components,
});

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;