import { viewerEndpoint } from "communication/viewerEndpoint";
import { loadImage } from "@utils/image";
import { getTextureInfo } from "@utils/webgl/textureInfoStore";
import { customOption } from "@common/constants";
import { textureBindings } from "./textureBindings";

export const getDefaultProps = () => ({
  optionId: customOption.id,
  value: "",
});

export const loadTextureForState = async (name: string, optionId: string, value: string) => {
  const textureInfo = getTextureInfo(name)?.textureInfo;

  if (!textureInfo) return;

  const binding = textureBindings.get(optionId);

  try {
    const uri = binding ? await viewerEndpoint.getExtensionFileUri(binding.fileName) : value;
    const img = await loadImage(uri);
    textureInfo.setSource(img);
  } catch {
    textureInfo.setPlaceholderTexture();
  }
};
