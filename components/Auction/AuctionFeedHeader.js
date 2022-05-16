export default function AuctionFeedHeader() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto pt-16 pb-8 px-4 sm:pt-24 sm:pb-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Latest bids
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            [Some description here]
          </p>
        </div>
      </div>
    </div>
  );
}
