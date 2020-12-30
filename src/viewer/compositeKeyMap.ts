export class CompositeKeyMap<TKey, TValue> {
  private map = new Map<string, TValue>();

  constructor(private keySelector: (compositeKey: TKey) => string) {}

  get(key: TKey) {
    return this.map.get(this.keySelector(key));
  }

  set(key: TKey, value: TValue) {
    this.map.set(this.keySelector(key), value);
  }

  clear() {
    this.map.clear();
  }
}
