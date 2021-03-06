export const translations = {
  custom: "Custom",
  synchronize: "Synchronize",
  shaders: {
    context: "Context",
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
  indices: {
    title: "Indices",
  },
  errors: {
    fetchingImage: "Unable to fetch image",
    emptyField: "Field cannot be empty",
    program: "PROGRAM:",
    vertexShader: "VERTEX SHADER:",
    fragmentShader: "FRAGMENT SHADER:",
    contextNotCreated: "Unable to create webgl context",
    parsing: {
      notArray: "Not an array",
      invalidJsonFormat: "Invalid JSON format",
      notEveryArrayElementSameSize: "Not every array element is same size",
    },
  },
  bindings: {
    meshPositions: "Binding - Mesh positions",
    meshTextureCoordinates: "Binding - Mesh texture coords",
    meshNormals: "Binding - Mesh normals",
    meshColors: "Binding - Mesh colors",
    meshIndices: "Binding - Mesh indices",
    textureSky: "Binding - Sky",
    textureGrass: "Binding - Grass",
    textureEgypt: "Binding - Egypt",
    uniformPerspectiveCamera: "Binding - Perspective Camera",
  },
  meshes: {
    cube: "Cube",
    sphere: "Sphere",
    plane: "Plane",
  },
} as const;
