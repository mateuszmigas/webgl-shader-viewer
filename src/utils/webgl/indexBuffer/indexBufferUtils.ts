import { translations } from "@common/translations";
import { meshes, MeshInfo } from "viewer/meshes";

const getMeshBinding = (meshId: string, name: keyof MeshInfo) =>
  JSON.stringify(meshes.get(meshId)[name]);

const bindings = new Map<string, { display: string; getValue: (id: string) => any }>([
  [
    "indices",
    {
      display: translations.bindings.meshIndices,
      getValue: id => getMeshBinding(id, "indices"),
    },
  ],
]);

export const getIndexBufferBinding = (name: string) => bindings.get(name);

export const getIndexBufferBindingOptions = () =>
  Array.from(bindings.entries()).map(([key, value]) => ({
    id: key,
    display: value.display,
  }));
