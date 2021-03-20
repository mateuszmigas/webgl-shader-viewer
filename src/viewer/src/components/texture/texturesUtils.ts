import { viewerEndpoint } from "../../../../common/communication/viewerEndpoint";
import { loadImage } from "../../utils/image";
import { getTextureInfo } from "../../utils/webgl/textureInfoStore";
import { customOption } from "../common/constants";
import { textureBindings } from "./textureBindings";

export const getDefaultProps = () => ({
  optionId: customOption.id,
  value: "",
});

export const loadTextureForState = (name: string, optionId: string, value: string) => {
  const textureInfo = getTextureInfo(name)?.textureInfo;

  if (!textureInfo) return;

  const binding = textureBindings.get(optionId);
  if (binding) {
    viewerEndpoint.getExtensionFileUri(binding.fileName).then(fileUri => {
      loadImage(fileUri).then(img => textureInfo.setSource(img));
    });
  } else {
    loadImage(value).then(img => textureInfo.setSource(img));
  }
};
