import React from "react";

const AppContext = React.createContext({
  auctions: [],
  setAuctions: () => {},
  auction: {},
  setAuction: () => {},
});

export default AppContext;
