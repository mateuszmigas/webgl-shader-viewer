import { translations } from "@common/translations";
import { getSerializedProp } from "viewer/meshes";

const indices = getSerializedProp("indices");

const bindings = new Map<string, { display: string; getValue: (id: string) => any }>([
  [
    "indices",
    {
      display: translations.bindings.meshIndices,
      getValue: id => indices.get(id),
    },
  ],
]);

export const getIndexBufferBinding = (name: string) => bindings.get(name);

export const getIndexBufferBindingOptions = () =>
  Array.from(bindings.entries()).map(([key, value]) => ({
    id: key,
    display: value.display,
  }));
