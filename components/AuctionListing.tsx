import Link from "next/link";
import { useContext } from "react";
import AppContext from "../context/AppContext";
import { AuctionStory } from "../stories";

export default function AuctionListing({ blok }) {
  const { auctions } = useContext(AppContext);
  console.log(blok, auctions);

  const posts = auctions.map((auction: AuctionStory) => ({
    title: auction.content.title,
    href: auction.full_slug,
    category: { name: "Article", href: "#" },
    description: auction.content.intro,
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    imageUrl: auction?.content.images[0].filename,
    readingTime: "[Pull latest bid]",
    author: {
      name: auction.content.artist.name,
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  }));
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
          {posts.map((post) => (
            <div
              key={post.title}
              className="flex flex-col rounded-lg shadow-lg overflow-hidden"
            >
              <Link href={post.href} className="flex-shrink-0">
                <a>
                  <img
                    className="h-64 w-full object-cover"
                    src={post.imageUrl}
                    alt=""
                  />
                </a>
              </Link>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <Link as="a" href={post.href} className="block mt-2">
                    <a>
                      <p className="text-xl font-semibold text-gray-900">
                        {post.title}
                      </p>
                      <p className="mt-3 text-base text-gray-500">
                        {post.description}
                      </p>
                    </a>
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {post.author.name}
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime={post.datetime}>{post.date}</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>{post.readingTime} read</span>
                    </div>
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
