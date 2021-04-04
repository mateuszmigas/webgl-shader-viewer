import { translations } from "./translations";
export const shaderExtensions = ["glsl"];
export const imagesExtensions = ["jpg"];
export const customOption = { id: "custom", display: translations.custom } as const;
export const customImageUrl = { id: "url", display: "Url" } as const;
export const workspaceImageUrl = { id: "workspace", display: "Workspace" } as const;
export const __prod__ = process.env.NODE_ENV === "production";
