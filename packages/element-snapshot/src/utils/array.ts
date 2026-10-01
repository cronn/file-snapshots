export function unwrapSingleItem<T>(items: Array<T>): T | Array<T> {
  return items.length === 1 ? (items.at(0) as T) : items;
}
