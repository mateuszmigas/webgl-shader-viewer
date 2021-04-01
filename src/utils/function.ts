import { shallowEqual } from "./object";

export function debounce<T extends Function>(func: T, wait = 500): T & { cancel: () => void } {
  let timeoutId = 0;
  let callable = Object.assign(
    (...args: any) => {
      if (timeoutId !== null) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => func(...args), wait) as any;
    },
    { cancel: () => clearTimeout(timeoutId) }
  );
  return <T & { cancel: () => void }>(<any>callable);
}

export const memoizeResult = <F extends (...newArgs: any[]) => ReturnType<F>>(func: F) => {
  let lastArgs: any[] = [];
  let lastResult: ReturnType<F>;
  let alreadyCalled: boolean = false;

  return ((...newArgs: any[]) => {
    if (alreadyCalled && newArgs.every((arg, index) => shallowEqual(arg, lastArgs[index]))) {
      return lastResult;
    }

    lastResult = func(...newArgs);
    lastArgs = newArgs;
    alreadyCalled = true;
    return lastResult;
  }) as F;
};
