import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import AuctionFeed from "./AuctionFeed";
import AuctionFeedHeader from "./AuctionFeedHeader";
import AuctionForm from "./AuctionForm";
import AuctionHeader from "./AuctionHeader";

import { useContext } from "react";
import AppContext from "../../context/AppContext";

const Auction = ({ story, pledges, blok }) => {
  const { setAuction } = useContext(AppContext);
  setAuction(story);
  return (
    <>
      <AuctionHeader story={blok} />
      <AuctionFeedHeader pledges={pledges}></AuctionFeedHeader>
      <></>
      {pledges.length ? (
        <div className="max-w-xl mx-auto">
          <AuctionFeed pledges={pledges} />
        </div>
      ) : (
        <div className="container mx-auto text-center">No bids yet</div>
      )}
      <AuctionForm story={story} pledges={pledges} />
      <main {...storyblokEditable(blok)}>
        {blok?.body?.map((nestedBlok) => (
          <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </main>
    </>
  );
};

export default Auction;
