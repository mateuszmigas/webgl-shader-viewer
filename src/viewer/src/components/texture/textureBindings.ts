export const textureBindings = new Map<string, { display: string; value: string }>([
  [
    "texture1",
    {
      display: "Binding - Texture 1",
      value: "url1",
    },
  ],
  [
    "texture2",
    {
      display: "Binding - Texture 2",
      value: "url2",
    },
  ],
]);

export const getBindingOptions = () =>
  Array.from(textureBindings.entries()).map(([key, value]) => ({
    id: key,
    display: value.display,
  }));
