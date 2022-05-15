import "../styles/globals.css";
import { storyblokInit, apiPlugin } from "@storyblok/react";
import { useState } from "react";
import Feature from "../components/Feature";
import Grid from "../components/Grid";
import Page from "../components/Page";
import Teaser from "../components/Teaser";
import Auction from "../components/Auction";
import AuctionListing from "../components/AuctionListing.tsx";
import Hero from "../components/Hero";

import AppContext from "../context/AppContext";

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
  accessToken: process.env.STORYBLOK_FRONTEND_TOKEN,
  use: [apiPlugin],
  components,
});

function MyApp({ Component, pageProps }) {
  const [auctions, setAuctions] = useState([]);
  const [auction, setAuction] = useState([]);
  return (
    <AppContext.Provider value={{ auctions, setAuctions, auction, setAuction }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
