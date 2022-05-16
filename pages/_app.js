import "../styles/globals.css";
import { storyblokInit } from "@storyblok/react";
import Feature from "../components/Feature";
import Grid from "../components/Grid";
import Page from "../components/Page";
import Teaser from "../components/Teaser";
import Auction from "../components/Auction";
import AuctionListing from "../components/AuctionListing";
import Hero from "../components/Hero";
import { SWRConfig } from "swr";
import axios from "axios";

const components = {
  feature: Feature,
  grid: Grid,
  teaser: Teaser,
  page: Page,
  auction: Auction,
  AuctionListing,
  Hero,
};

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_FRONTEND_TOKEN,
  components,
});

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 10_000,
        fetcher: (url) => axios.get(url).then((res) => res.data),
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
