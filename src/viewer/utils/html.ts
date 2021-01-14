export const observeElementBoundingRect = (
  element: Element,
  callback: (rectangle: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void
): (() => void) => {
  const resizeObserver = new ResizeObserver(elements => {
    const observerEntry = elements.find(e => e.target === element);

    if (observerEntry) {
      const domRect = observerEntry.target.getBoundingClientRect();
      callback({
        x: domRect.x,
        y: domRect.y,
        width: domRect.width,
        height: domRect.height,
      });
    }
  });

  resizeObserver.observe(element);
  return () => resizeObserver.disconnect();
};
