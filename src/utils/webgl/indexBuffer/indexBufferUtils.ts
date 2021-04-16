import { MeshInfo } from "@meshes";
import { translations } from "@common/translations";
import { getSerializedProp } from "@meshes";

const indices = getSerializedProp("indices");

const bindings = new Map<keyof MeshInfo, { display: string; getValue: (id: string) => any }>([
  [
    "indices",
    {
      display: translations.bindings.meshIndices,
      getValue: id => indices.get(id),
    },
  ],
]);

export const getIndexBufferBinding = (name: string) => bindings.get(name as keyof MeshInfo);

export const getIndexBufferBindingOptions = () =>
  Array.from(bindings.entries()).map(([key, value]) => ({
    id: key,
    display: value.display,
  }));
