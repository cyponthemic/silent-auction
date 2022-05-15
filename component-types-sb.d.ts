export interface AuctionStoryblok {
  title?: string;
  intro?: string;
  images?: {
    alt?: string;
    copyright?: string;
    id: number;
    filename: string;
    name: string;
    title?: string;
  }[];
  description?: any;
  body?: any[];
  _uid: string;
  component: "auction";
  [k: string]: any;
}

export interface AuctionListingStoryblok {
  heading?: string;
  description?: string;
  _uid: string;
  component: "AuctionListing";
  [k: string]: any;
}

export interface FeatureStoryblok {
  name?: string;
  _uid: string;
  component: "feature";
  [k: string]: any;
}

export interface GridStoryblok {
  columns?: any[];
  _uid: string;
  component: "grid";
  [k: string]: any;
}

export interface HeroStoryblok {
  title?: string;
  description?: string;
  ctas?: any[];
  _uid: string;
  component: "Hero";
  [k: string]: any;
}

export interface PageStoryblok {
  body?: any[];
  _uid: string;
  component: "page";
  uuid?: string;
  [k: string]: any;
}

export interface PledgesStoryblok {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  amount?: string;
  auction?: string;
  _uid: string;
  component: "pledges";
  [k: string]: any;
}

export interface TeaserStoryblok {
  headline?: string;
  _uid: string;
  component: "teaser";
  [k: string]: any;
}
