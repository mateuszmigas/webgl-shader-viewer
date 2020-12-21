export type DropdownItem = {
  id: string;
  display: string;
};

const defaultOptions = {
  emptyItem: true
}

export const createDropdown = (
  //initialValue: DropdownItem | null,
  onChange: (item: DropdownItem | null) => void,
  className?: string,
  options?: { emptyItem: boolean } //placeholder
): [
    HTMLSelectElement,
    {
      setItems: (items: DropdownItem[]) => void;
      getItems: () => DropdownItem[];
      setSelectedItemById: (id: string) => void;
      getSelectedItem: () => DropdownItem | null;
      clearSelection: () => void;
    }
  ] => {
  const combinedOptions = { ...defaultOptions, ...options };
  const element = document.createElement("select");
  element.className = `dropdown-base ${className}`;

  let selectedItem: DropdownItem | null = null;
  let itemElements: { element: HTMLOptionElement; item: DropdownItem }[] = [];
  const setSelectedItem = (item: DropdownItem | null) => {
    selectedItem = item;
    onChange(selectedItem);
  };

  element.onchange = () => {
    const foundElement = itemElements.find((e) => e.item.id === element.value);

    if (foundElement.item.id) setSelectedItem(foundElement.item);
    else setSelectedItem(null);
  };

  const setItems = (items: DropdownItem[]) => {
    element.innerHTML = "";
    itemElements.length = 0;

    if (!items.find((i) => i.id === selectedItem?.id)) {
      setSelectedItem(null);
    }

    const newItems = combinedOptions.emptyItem ? [{ id: "", display: "" }, ...items] : [...items];
    newItems.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.display;
      option.selected = item.id === selectedItem?.id;
      element.appendChild(option);
      itemElements.push({ element: option, item });
    });
  };

  const getItems = () => itemElements.map((ie) => ie.item);
  const setSelectedItemById = (id: string) => {
    setSelectedItem(null);
    itemElements.forEach((ie) => {
      if (ie.item.id === id) {
        ie.element.selected = true;
        setSelectedItem(ie.item);
      } else {
        ie.element.selected = false;
      }
    });
  };

  const getSelectedItem = () => selectedItem;
  const clearSelection = () => {
    itemElements.forEach((ie) => (ie.element.selected = false));
    setSelectedItem(null);
  };

  return [
    element,
    {
      setItems,
      getItems,
      setSelectedItemById,
      getSelectedItem,
      clearSelection,
    },
  ];
};
