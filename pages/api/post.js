// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const StoryblokClient = require("storyblok-js-client");
const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_BACKEND_TOKEN,
});
export default function handler(req, res) {
  if (req.method === "POST") {
    // use the universal js client to perform the request
    return Storyblok.post("spaces/156827/stories/", {
      story: {
        name: `${req.body.firstName} ${req.body.lastName} - $${req.body.amount}`,
        slug: `${req.body.firstName}-${req.body.lastName}-${req.body.amount}`,
        parent_id: 132726651,
        content: req.body,
      },
      publish: 1,
    })
      .then((response) => {
        return res.status(200).json({ response });
      })
      .catch((error) => {
        return res.status(500).json({ error });
      });
  }
}
