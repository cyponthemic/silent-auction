import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import AuctionFeed from "./AuctionFeed";
import AuctionFeedHeader from "./AuctionFeedHeader";
import AuctionHeader from "./AuctionHeader";
import Head from "next/head";

const Auction = ({ blok }) => {
  const canBid = !blok.is_live_auction;

  return (
    <>
      <Head>
        <title>{blok.title} - Open Mess</title>
        <meta property="og:image" content={blok?.images[0]?.filename} />
      </Head>

      <AuctionHeader story={blok} />

      {canBid && (
        <>
          <AuctionFeedHeader />
          <AuctionFeed />
        </>
      )}

      <main className="pt-16 sm:pt-24" {...storyblokEditable(blok)}>
        {blok?.body?.map((nestedBlok) => (
          <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </main>
    </>
  );
};

export default Auction;
