import Joi from "joi";
import prisma from "../../../../lib/prisma";
import { formatCentsToDollars } from "../../../../lib/money/format";
import { sendSms } from "../../../../lib/sms";
import { getCreateBidSchema } from "../../../../lib/services/bid";
import { isPast } from "date-fns";

const createBidSchema = getCreateBidSchema(Joi);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    query: { auctionItemId },
    body,
  } = req;

  const data = createBidSchema.validate(body);
  const { value, error } = data;

  if (error) {
    return res.status(422).json(error.message);
  }

  const auctionItem = await prisma.auctionItem.findUnique({
    where: { id: auctionItemId },
  });

  if (!auctionItem) {
    return res.status(404).json("Not found");
  }

  // Check if bidding has closed
  if (isPast(auctionItem.closesAt)) {
    return res.status(400).json("Sorry, bidding has closed for this item.");
  }

  try {
    const [previousHighest, newBid] = await prisma.$transaction(
      async (prisma) => {
        // Get the highest bid for validation
        const highestBid = await prisma.bid.findFirst({
          where: { auctionItemId },
          orderBy: { amount: "desc" },
        });

        // Make sure the new bid is $5 higher
        if (highestBid && value.amount < highestBid.amount + 500) {
          return [highestBid, null]; // Don't return a new bid
        }

        // Add the new bid
        const newBid = await prisma.bid.create({
          data: { ...value, auctionItemId },
        });

        return [highestBid, newBid];
      }
    );

    if (!newBid) {
      const dollars = formatCentsToDollars(previousHighest.amount);
      return res
        .status(400)
        .json(
          `Please enter a bid that's at least $5 higher the current bid of ${dollars}`
        );
    }

    const url = `https://open-mess.vercel.app/auctions/${auctionItem.slug}`;
    let previousBidderNotification;

    if (previousHighest?.notifyOnChange) {
      try {
        const difference = formatCentsToDollars(
          newBid.amount - previousHighest.amount
        );

        previousBidderNotification = sendSms(
          previousHighest.phone,
          `Your bid for "${auctionItem.name}" has been beaten by ${difference}. ${url}`
        );
      } catch (e) {
        console.error("Failed to send SMS", e);
      }
    }

    const currentBid = formatCentsToDollars(newBid.amount);

    await Promise.all([
      previousBidderNotification,
      sendSms(
        newBid.phone,
        `Your bid of ${currentBid} has been received for "${auctionItem.name}". ${url}`
      ),
    ]);

    // Respond with created item
    return res.status(200).json(newBid);
  } catch (e) {
    return res.status(500).json(e.message);
  }
}
