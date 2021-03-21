export const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "";
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = e => reject(e);
  });
