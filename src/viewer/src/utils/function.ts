export function debounce<T extends Function>(callback: T, wait = 500) {
  let timeoutId = 0;
  let callable = (...args: any) => {
    if (timeoutId !== null) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => callback(...args), wait) as any;
  };
  return <T>(<any>callable);
}
