export const textureBindings = new Map<string, { display: string; fileName: string }>([
  [
    "texture-sky",
    {
      display: "Binding - Sky",
      fileName: "texture-sky.jpg",
    },
  ],
  [
    "texture-grass",
    {
      display: "Binding - Grass",
      fileName: "texture-grass.jpg",
    },
  ],
  [
    "texture-egypt",
    {
      display: "Binding - Egypt",
      fileName: "texture-egypt.jpg",
    },
  ],
]);

export const getBindingOptions = () =>
  Array.from(textureBindings.entries()).map(([key, value]) => ({
    id: key,
    display: value.display,
  }));
