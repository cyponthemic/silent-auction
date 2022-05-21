export const storyblokImageLoader = ({ src, width, height, quality }) => {
  return `${src}/m/${width}x${height || 0}/filters:quality(${quality || 75})`;
};

export function getImageWidth(src) {
  return src.split("/")[5].split("x")[0];
}

export function getImageHeight(src) {
  return src.split("/")[5].split("x")[1];
}
