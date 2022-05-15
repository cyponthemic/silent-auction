import Joi from "joi";
import prisma from "../../../../lib/prisma";
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import { formatCentsToDollars } from "../../../../lib/money/format";

const schema = Joi.object({
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  phone: Joi.string()
    .required()
    .custom((value) => {
      if (!isValidPhoneNumber(value, "AU")) {
        throw new Error("Please enter a valid phone number");
      }
      return parsePhoneNumber(value, "AU").formatInternational();
    }),
  amount: Joi.number().integer().positive().required(),
  notifyOnChange: Joi.boolean().default(false),
});

export default async function handler(req, res) {
  const {
    query: { itemId },
    method,
    body,
  } = req;

  const highestBidQuery = {
    where: { auctionItemId: itemId },
    orderBy: { amount: "desc" },
  };

  switch (method) {
    case "GET":
      const bids = await prisma.bid.findMany(highestBidQuery);

      res.status(200).json(bids);
      break;

    case "POST":
      const data = schema.validate(body);
      const { value, error } = data;

      if (error) {
        res.status(422).json(error.message);
        break;
      }

      try {
        const [previousHighest, newBid] = await prisma.$transaction(
          async (prisma) => {
            // Get the highest bid for validation
            const highestBid = await prisma.bid.findFirst(highestBidQuery);

            // Make sure the new bid is higher
            if (value.amount <= highestBid.amount) {
              const dollars = formatCentsToDollars(highestBid.amount);
              throw new Error(
                `Please enter a bid that's higher the current bid of ${dollars}`
              );
            }

            // Add the new bid
            const newBid = await prisma.bid.create({
              data: { ...value, auctionItemId: itemId },
            });

            return [highestBid, newBid];
          }
        );

        // TODO: Send notification to previous highest bid

        // Respond with created item
        res.status(200).json({ previousHighest, newBid });
      } catch (e) {
        res.status(400).json(e.message);
        break;
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
