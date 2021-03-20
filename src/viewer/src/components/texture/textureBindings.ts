export const textureBindings = new Map<string, { display: string; fileName: string }>([
  [
    "texture1",
    {
      display: "Binding - Texture 1",
      fileName: "texture1.jpg",
    },
  ],
  [
    "texture2",
    {
      display: "Binding - Texture 2",
      fileName: "texture2.jpg",
    },
  ],
]);

export const getBindingOptions = () =>
  Array.from(textureBindings.entries()).map(([key, value]) => ({
    id: key,
    display: value.display,
  }));
