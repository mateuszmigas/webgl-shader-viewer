export const translations = {
  custom: "Custom",
  shaders: {
    title: "Shaders",
    syncTooltip: "Synchronize extension with workspace glsl files",
  },
  vertexShader: "Vertex Shader",
  fragmentShader: "Fragment Shader",
  drawOptions: { title: "Draw options", drawMode: { elements: "Elements", arrays: "Arrays" } },
  textures: {
    title: "Textures",
    customUrl: "Custom URL",
  },
  uniforms: "Uniforms",
  attributeBuffers: "Attribute Buffers",
  errors: {
    fetchingImage: "Unable to fetch image",
    emptyUrl: "URL cannot be empty",
    program: "PROGRAM:",
    vertexShader: "VERTEX SHADER:",
    fragmentShader: "FRAGMENT SHADER:",
    contextNotCreated: "Unable to create webgl context",
  },
  bindings: {
    meshPositions: "Binding - Mesh positions",
    meshTextureCoordinates: "Binding - Mesh texture coords",
    meshColors: "Binding - Mesh colors",
    meshIndices: "Binding - Mesh indices",
    textureSky: "Binding - Sky",
    textureGrass: "Binding - Grass",
    textureEgypt: "Binding - Egypt",
    uniformPerspectiveCamera: "Binding - Perspective Camera",
  },
} as const;
