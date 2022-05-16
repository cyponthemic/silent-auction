import { formatDistanceToNow, formatISO } from "date-fns";
import { CashIcon } from "@heroicons/react/solid";
import { useAuctionContext } from "../../lib/context/auction";
import { formatCentsToDollars } from "../../lib/money/format";
import { useEffect, useState } from "react";

export default function AuctionFeed({ pledges }) {
  const { bids } = useAuctionContext();

  if (bids.length === 0) {
    return <div className="max-w-7xl mx-auto text-center">No bids yet</div>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flow-root px-4 sm:px-8 xl:pr-16">
        <ul role="list" className="-mb-8">
          {bids.map((bid, index) => (
            <AuctionFeedItem
              key={bid.id}
              bid={bid}
              isLastItem={index === bids.length - 1}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function AuctionFeedItem({ bid, isLastItem }) {
  const [createdAt, setCreatedAt] = useState();

  // Use effect so that it only runs client side
  useEffect(() => {
    setCreatedAt(new Date(bid.createdAt));
  }, [bid.createdAt]);

  return (
    <li>
      <div className="relative pb-8">
        {!isLastItem && (
          <span
            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
        )}
        <div className="relative flex space-x-3">
          <div>
            <span
              className={
                "bg-green-500 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
              }
            >
              <CashIcon className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
          </div>
          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
            <div>
              <p className="font-medium text-gray-500">
                {formatCentsToDollars(bid.amount)}
              </p>
            </div>
            <div className="text-right text-sm whitespace-nowrap text-gray-500">
              {createdAt && (
                <time dateTime={formatISO(createdAt)}>
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </time>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
