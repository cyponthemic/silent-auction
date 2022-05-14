import prisma from "../../../../lib/prisma";

export default function handler(req, res) {
  const {
    query: { itemId, amount },
    method,
  } = req;

  switch (method) {
    case "POST":
      // Validate

      // const [prevHighestBid, _] = prisma.$transaction([
      //   prisma.bid.findFirst(...),
      //   prisma.bid.create(...),
      // ])

      // Send notifications with Twilio

      // Respond with created item
      res.status(200).json("ok");

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
