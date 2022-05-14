/* This example requires Tailwind CSS v2.0+ */
import { CheckIcon, ThumbUpIcon, UserIcon } from "@heroicons/react/solid";
import Moment from "moment";
import { getMinimumBid } from "../../helpers/pledges";
import { orderBy } from "lodash-es";
import { useAuctionContext } from "../../lib/context/auction";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AuctionFeed({ pledges }) {
  const auction = useAuctionContext();

  console.log("auction context", auction);

  return <div className="container mx-auto text-center">No bids yet</div>;

  const timeline = orderBy(
    pledges,
    [(pledge) => Number(pledge.content.amount)],
    ["desc"]
  ).map((pledge) => ({
    id: pledge.id,
    content: `${pledge.content.firstName} ${pledge.content.lastName}`,
    target: pledge.content.amount,
    href: "#",
    date: Moment(pledge.first_published_at).format("d MMM, h:mm:ss a"),
    datetime: pledge.first_published_at,
    icon: CheckIcon,
    iconBackground: "bg-green-500",
  }));

  const min = getMinimumBid(pledges);
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {timeline.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== timeline.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={classNames(
                      event.iconBackground,
                      "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                    )}
                  >
                    <event.icon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {event.content}{" "}
                      <a
                        href={event.href}
                        className="font-medium text-gray-900"
                      >
                        AUD${event.target}
                      </a>
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={event.datetime}>{event.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
