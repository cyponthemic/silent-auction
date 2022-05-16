import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import AuctionFeed from "./AuctionFeed";
import AuctionFeedHeader from "./AuctionFeedHeader";
import AuctionHeader from "./AuctionHeader";

const Auction = ({ blok }) => {
  return (
    <>
      <AuctionHeader story={blok} />

      <AuctionFeedHeader></AuctionFeedHeader>

      <AuctionFeed />

      <main className="pt-16 sm:pt-24" {...storyblokEditable(blok)}>
        {blok?.body?.map((nestedBlok) => (
          <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </main>
    </>
  );
};

export default Auction;
