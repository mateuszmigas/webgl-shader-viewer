import { CompositeKeyMap } from "../compositeKeyMap";
import { TextureInfo } from "./texture";
type CacheKey = {
  name: string;
};

type CacheValue = {
  component: HTMLElement;
  textureInfo: TextureInfo;
  dispose: () => void;
};

const keySelector = (key: CacheKey): string => key.name;
const componentCache = new CompositeKeyMap<CacheKey, CacheValue>(keySelector);

const rebuildCache = (newValues: { key: CacheKey; value: CacheValue }[]) => {
  const newValuesStrKeys = newValues.map(v => keySelector(v.key));
  const componentsToRemove = componentCache
    .entriesStrKey()
    .filter(e => !newValuesStrKeys.includes(e[0]));

  componentsToRemove.forEach(c => {
    c[1].dispose();
    componentCache.deleteStrKey(c[0]);
  });

  newValues.forEach(nw => {
    if (!componentCache.has(nw.key)) componentCache.set(nw.key, nw.value);
  });
};
