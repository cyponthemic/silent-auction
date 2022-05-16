import { useContext, createContext } from "react";

const AuctionContext = createContext({
  id: "",
  storyblokUuid: "",
  name: "",
  startingBid: 5000,
  bids: [],
});

export const AuctionContextProvider = AuctionContext.Provider;

export function useAuctionContext() {
  return useContext(AuctionContext);
}
