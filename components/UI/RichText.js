const StoryblokClient = require("storyblok-js-client");

let Storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK_FRONTEND_TOKEN,
});

function createMarkup(storyblokHTML) {
  return {
    __html: Storyblok.richTextResolver.render(storyblokHTML),
  };
}

const RichTextField = ({ data }) => {
  return <div dangerouslySetInnerHTML={createMarkup(data)} />;
};

export default RichTextField;
