import { translations } from "./translations";
export const shaderExtensions = ["glsl"];
export const customOption = { id: "custom", display: translations.custom };
export const __prod__ = process.env.NODE_ENV === "production";
