import React, { useContext } from "react";

const AuctionsContext = React.createContext({
  auctions: [],
});

export const AuctionsContextProvider = AuctionsContext.Provider;
export const useAuctionsContext = () => useContext(AuctionsContext);

export default AuctionsContext;
