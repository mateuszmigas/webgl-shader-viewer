import { translations } from "@common/translations";
import { meshes, MeshInfo } from "../../meshes";

const getMeshBinding = (meshId: string, name: keyof MeshInfo) =>
  JSON.stringify(meshes.get(meshId)[name]);

export const indexBufferBindings = new Map<
  string,
  { display: string; getValue: (id: string) => any }
>([
  [
    "indices",
    {
      display: translations.bindings.meshIndices,
      getValue: id => getMeshBinding(id, "indices"),
    },
  ],
]);

export const getBindingOptions = () =>
  Array.from(indexBufferBindings.entries()).map(([key, value]) => ({
    id: key,
    display: value.display,
  }));
