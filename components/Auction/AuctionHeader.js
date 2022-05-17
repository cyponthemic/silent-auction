import Image from "next/image";
import { render as renderRichText } from "storyblok-rich-text-react-renderer";
import AuctionForm from "./AuctionForm";

export default function AuctionHeader({ story }) {
  const canBid = !story.is_live_auction;

  return (
    <div className="relative bg-gray-50">
      <main className="lg:relative">
        <div className="mx-auto max-w-7xl w-full pt-16 pb-20 lg:py-48">
          <div className="px-4 lg:w-1/2 sm:px-8 xl:pr-16">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl text-center lg:text-left">
              <span className="block xl:inline">{story.title}</span>
            </h1>

            {story.artist && (
              <div className="mt-3 max-w-md mx-auto text-md md:mt-5 md:max-w-3xl text-center lg:text-left">
                {story.artist.name}
              </div>
            )}

            <div className="mt-3 max-w-md mx-auto text-md text-gray-500 md:mt-5 md:max-w-3xl text-center lg:text-left">
              {renderRichText(story.description)}
            </div>

            {canBid && (
              <div className="mt-12">
                <AuctionForm />
              </div>
            )}
          </div>
        </div>

        <div className="relative w-full h-64 sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full">
          <Image
            className="absolute inset-0 w-full h-full object-cover"
            src={story?.images[0]?.filename}
            layout="fill"
            alt=""
          />
        </div>
      </main>
    </div>
  );
}
