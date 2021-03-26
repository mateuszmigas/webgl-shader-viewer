import { translations } from "@common/translations";
export const textureBindings = new Map<string, { display: string; fileName: string }>([
  [
    "texture-sky",
    {
      display: translations.bindings.textureSky,
      fileName: "texture-sky.jpg",
    },
  ],
  [
    "texture-grass",
    {
      display: translations.bindings.textureGrass,
      fileName: "texture-grass.jpg",
    },
  ],
  [
    "texture-egypt",
    {
      display: translations.bindings.textureEgypt,
      fileName: "texture-egypt.jpg",
    },
  ],
]);

export const getBindingOptions = () =>
  Array.from(textureBindings.entries()).map(([key, value]) => ({
    id: key,
    display: value.display,
  }));
