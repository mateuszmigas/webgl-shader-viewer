export const textureBindings: { [key: string]: { display: string; value: string } } = {
  texture1: { display: "tes 1", value: "fsefsfs" },
  texture2: { display: "tex 22", value: "aefaef" },
};

export const bindingNames = new Set<string>(Object.keys(textureBindings));

export const getBindingValue = (name: string) => textureBindings[name].value;

export const getBindingOptions = () => {
  return Object.entries(textureBindings).map(([key, value]) => ({
    id: key,
    display: value.display,
  }));
};
