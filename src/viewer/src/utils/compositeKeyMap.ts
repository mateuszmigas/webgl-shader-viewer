export class CompositeKeyMap<TKey, TValue> {
  private map = new Map<string, TValue>();

  constructor(private keySelector: (compositeKey: TKey) => string) {}

  get(key: TKey) {
    return this.map.get(this.keySelector(key));
  }

  set(key: TKey, value: TValue) {
    this.map.set(this.keySelector(key), value);
  }

  has(key: TKey) {
    return this.map.has(this.keySelector(key));
  }

  entriesStrKey() {
    return Array.from(this.map.entries());
  }

  deleteStrKey(key: string) {
    this.map.delete(key);
  }

  delete(key: TKey) {
    this.map.delete(this.keySelector(key));
  }

  clear() {
    this.map.clear();
  }
}
