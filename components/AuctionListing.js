import Link from "next/link";
import { useAuctionsContext } from "../context/AuctionsContext";
import { classNames } from "../lib/utils/class-names";

export default function AuctionListing({ blok }) {
  const { auctions } = useAuctionsContext();

  return (
    <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
      <div className="absolute inset-0">
        <div className="bg-white h-1/3 sm:h-2/3" />
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
            {blok.heading}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {blok.description}
          </p>
        </div>
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="relative flex flex-col rounded-lg shadow-lg overflow-hidden"
            >
              <Link href={`/${auction.full_slug}`} className="flex-shrink-0">
                <a>
                  {auction.content.images.length > 0 && (
                    <img
                      className="h-64 w-full object-cover"
                      src={auction.content.images[0].filename}
                      alt=""
                    />
                  )}
                </a>
              </Link>

              <div
                className={classNames(
                  "absolute top-3 right-3 py-1 px-2 rounded-md",
                  auction.content.is_live_auction
                    ? "bg-blue-300"
                    : "bg-green-300"
                )}
              >
                {auction.content.is_live_auction
                  ? "Live Auction"
                  : "Silent Auction"}
              </div>

              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <Link href={`/${auction.full_slug}`} className="block mt-2">
                    <a>
                      <p className="text-xl font-semibold text-gray-900">
                        {auction.content.title}
                      </p>
                      {/*<p className="mt-3 text-base text-gray-500">*/}
                      {/*  {auction.content.intro}*/}
                      {/*</p>*/}
                    </a>
                  </Link>
                </div>
                <div className="mt-3 flex items-center">
                  <div className="">
                    <p className="text-sm font-medium text-gray-900">
                      {auction.content.artist.name}
                    </p>
                    {/*<div className="flex space-x-1 text-sm text-gray-500">*/}
                    {/*  <time dateTime={auction.datetime}>{auction.date}</time>*/}
                    {/*  <span aria-hidden="true">&middot;</span>*/}
                    {/*  <span>{auction.readingTime} read</span>*/}
                    {/*</div>*/}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
