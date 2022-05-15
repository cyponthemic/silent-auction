import Joi from "joi";
import prisma from "../../../../lib/prisma";
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import { formatCentsToDollars } from "../../../../lib/money/format";
import { sendSms } from "../../../../lib/sms";

const schema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
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
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    query: { auctionItemId },
    body,
  } = req;

  const data = schema.validate(body);
  const { value, error } = data;

  if (error) {
    return res.status(422).json(error.message);
  }

  try {
    const [previousHighest, newBid] = await prisma.$transaction(
      async (prisma) => {
        // Get the highest bid for validation
        const highestBid = await prisma.bid.findFirst({
          where: { auctionItemId },
          orderBy: { amount: "desc" },
        });

        // Make sure the new bid is higher
        if (value.amount <= highestBid.amount) {
          const dollars = formatCentsToDollars(highestBid.amount);
          throw new Error(
            `Please enter a bid that's higher the current bid of ${dollars}`
          );
        }

        // Add the new bid
        const newBid = await prisma.bid.create({
          data: { ...value, auctionItemId },
        });

        return [highestBid, newBid];
      }
    );

    if (previousHighest.notifyOnChange) {
      try {
        const difference = formatCentsToDollars(
          newBid.amount - previousHighest.amount
        );
        await sendSms(
          previousHighest.phone,
          `Your bid was beaten by ${difference}`
        );
      } catch (e) {
        console.error("Failed to send SMS", e);
      }
    }

    // Respond with created item
    return res.status(200).json({ previousHighest, newBid });
  } catch (e) {
    return res.status(400).json(e.message);
  }
}
