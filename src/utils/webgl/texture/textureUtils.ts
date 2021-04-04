import { translations } from "@common/translations";

const bindings = new Map<string, { display: string; fileName: string }>([
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

export const getTextureBinding = (name: string) => bindings.get(name);

export const getTextureBindingOptions = () =>
  Array.from(bindings.entries()).map(([key, value]) => ({
    id: key,
    display: value.display,
  }));

export const getDefaultTextureState = () => ({
  optionId: "texture-sky",
  customUrl: "",
  workspaceUrl: "",
  error: "",
});
