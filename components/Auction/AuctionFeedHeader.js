import { getMinimumBid } from "../../helpers/pledges";
import { formatCentsToDollars } from "../../lib/money/format";
import { useAuctionContext } from "../../lib/context/auction";

export default function AuctionFeedHeader() {
  const { bids } = useAuctionContext();

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto pt-16 pb-8 px-4 sm:pt-24 sm:pb-12 sm:px-6 lg:px-8">
        <div className="text-center">
          {bids.length > 0 && (
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              {formatCentsToDollars(bids[0].amount)}
            </h2>
          )}
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Latest bid
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Start building for free, then add a site plan to go live. Account
            plans unlock additional features.
          </p>
        </div>
      </div>
    </div>
  );
}
