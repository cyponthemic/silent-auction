import { StoryData } from "storyblok-js-client";
import { AuctionStoryblok } from "./component-types-sb";

export interface AuctionStory extends StoryData {
  content: AuctionStoryblok;
}
