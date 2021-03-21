export function debounce<T extends Function>(func: T, wait = 500) {
  let timeoutId = 0;
  let callable = (...args: any) => {
    if (timeoutId !== null) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => func(...args), wait) as any;
  };
  return <T>(<any>callable);
}
