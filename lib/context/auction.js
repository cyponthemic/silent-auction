import { useContext, createContext } from "react";

const AuctionContext = createContext({
  auctionId: null,
  bids: [],
});

export const AuctionContextProvider = AuctionContext.Provider;

export function useAuctionContext() {
  return useContext(AuctionContext);
}
