import { formatDistanceToNow, formatISO } from "date-fns";
import { CheckIcon } from "@heroicons/react/solid";
import { useAuctionContext } from "../../lib/context/auction";
import { formatCentsToDollars } from "../../lib/money/format";

export default function AuctionFeed({ pledges }) {
  const { bids } = useAuctionContext();

  if (bids.length === 0) {
    return <div className="container mx-auto text-center">No bids yet</div>;
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {bids.map((bid, index) => (
          <li key={bid.id}>
            <div className="relative pb-8">
              {index !== bids.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={
                      "bg-green-500 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                    }
                  >
                    <CheckIcon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="font-medium text-gray-500">
                      {formatCentsToDollars(bid.amount)}
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={formatISO(bid.createdAt)}>
                      {formatDistanceToNow(bid.createdAt, { addSuffix: true })}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  // const timeline = orderBy(
  //   pledges,
  //   [(pledge) => Number(pledge.content.amount)],
  //   ["desc"]
  // ).map((pledge) => ({
  //   id: pledge.id,
  //   content: `${pledge.content.firstName} ${pledge.content.lastName}`,
  //   target: pledge.content.amount,
  //   href: "#",
  //   date: Moment(pledge.first_published_at).format("d MMM, h:mm:ss a"),
  //   datetime: pledge.first_published_at,
  //   icon: CheckIcon,
  //   iconBackground: "bg-green-500",
  // }));
  //
  // const min = getMinimumBid(pledges);
}
