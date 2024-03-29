# WebGL Shader Viewer

Visual Studio Code extension for previewing shader files inside the editor.

![](https://github.com/mateuszmigas/webgl-shader-viewer/blob/main/docs/images/presentation.gif?raw=true)

## Features

1. Watches attached shader files and recompiles shaders on the fly
2. Creates controls for setting attribute buffers/uniforms/textures
3. Renders selected data or compile errors

## Installation

https://marketplace.visualstudio.com/items?itemName=mateuszmigas.webgl-shader-viewer

## How to run

1. Open directory/workspace with glsl files in Visual Studio Code
2. Run "Open WebGL Shader Viewer" command to activate the extension
3. Select vertex and fragment shader files

All values can be set manually. For some types you can also use bindings.

## Configuration

It's possible to change configuration in Visual Studio settings

| Key                                | Values        |
| ---------------------------------- | ------------- |
| webglShaderViewer.renderingContext | WebGL, WebGL2 |

### Synchronization

At the start, the extension will do synchronization of glsl and image files. Later when new files in the workspace/directory are added click "Synchronize" to do this manually.

### Uniforms

| Name                         | Type                 | Description              |
| ---------------------------- | -------------------- | ------------------------ |
| Custom                       | Any WebGL compatible | Custom user data         |
| Binding - Perspective Camera | Matrix 4x4           | 3D orbit controls matrix |

### Attribute buffers

| Name                          | Type       | Description                                      |
| ----------------------------- | ---------- | ------------------------------------------------ |
| Custom                        | number[][] | Custom array of arrays (Ex: [[0,0],[1,2],[3,1]]) |
| Binding - Mesh positions      | Vec4       | Selected mesh positions                          |
| Binding - Mesh texture coords | Vec2       | Selected mesh texture coordinates                |
| Binding - Mesh normals        | Vec3       | Selected mesh normals                            |
| Binding - Mesh colors         | Vec3       | Selected mesh predefined faces colors            |

This field will show an error if data cannot be parsed

### Index buffer

| Name                   | Type     | Description           |
| ---------------------- | -------- | --------------------- |
| Custom                 | number[] | Custom array          |
| Binding - Mesh indices | number[] | Selected mesh indices |

This field will show an error if data cannot be parsed

### Textures

| Name            | Description                                      |
| --------------- | ------------------------------------------------ |
| Url             | Custom texture url                               |
| Workspace       | Allows setting texture from workspace (jpg, png) |
| Binding - Grass | Extension texture                                |
| Binding - Sky   | Extension texture                                |
| Binding - Egypt | Extension texture                                |

Url will show an error if the extension cannot fetch the image due to security reasons.
Workspace images are not always working and might be blocked, depends on the image.

### Draw mode/indices

Rendering can run either in "array" or "elements" mode for which you can set index buffer.

## Bugs

If you find any bugs or think something can be improved feel free to contact me:
mateuszmigas.dev@gmail.com

## Example shaders

Webgl_Vertex.glsl

```js
attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 aTextureCoord;
uniform mat4 u_cameraMatrix;
varying vec3 v_normal;
varying highp vec2 vTextureCoord;

void main(){
    gl_Position=u_cameraMatrix*a_position;
    v_normal=a_normal;
    vTextureCoord=aTextureCoord;
}
```

Webgl_Fragment.glsl

```js
precision mediump float;
uniform vec3 u_reverseLightDirection;
uniform sampler2D uSampler;
varying vec3 v_normal;
varying highp vec2 vTextureCoord;

void main(){
    vec3 normal=normalize(v_normal);
    vec4 textureColor=texture2D(uSampler,vTextureCoord);
    float light=dot(normal,u_reverseLightDirection);
    gl_FragColor=vec4(light*textureColor.rgb,1);
}
```

Webgl2_Vertex.glsl

```js
#version 300 es
in vec4 a_position;
in vec3 a_normal;
in vec2 aTextureCoord;
uniform mat4 u_cameraMatrix;
out vec3 v_normal;
out highp vec2 vTextureCoord;

void main(){
    gl_Position=u_cameraMatrix*a_position;
    v_normal=a_normal;
    vTextureCoord=aTextureCoord;
}
```

Webgl2_Fragment.glsl

```js
#version 300 es
precision mediump float;
uniform vec3 u_reverseLightDirection;
uniform sampler2D uSampler;
in vec3 v_normal;
in highp vec2 vTextureCoord;
out vec4 outColor;

void main(){
    vec3 normal=normalize(v_normal);
    vec4 textureColor=texture(uSampler,vTextureCoord);
    float light=dot(normal,u_reverseLightDirection);
    outColor=vec4(light*textureColor.rgb,1);
}

```

### License

[MIT](https://choosealicense.com/licenses/mit/)
