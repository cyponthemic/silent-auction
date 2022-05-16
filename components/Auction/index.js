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

      <AuctionFeed pledges={pledges} />

      <main {...storyblokEditable(blok)}>
        {blok?.body?.map((nestedBlok) => (
          <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </main>
    </>
  );
};

export default Auction;
