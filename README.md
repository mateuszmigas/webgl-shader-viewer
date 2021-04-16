# WebGL Shader Viewer

This is a Visual Studio Code extension for previewing shader files.
![](https://github.com/mateuszmigas/webgl-shader-viewer/blob/main/docs/images/presentation.gif)

## Features

1. Shows predefined or custom models using selected shaders from workspace in vscode webview
2. Shows shader compile errors
3. Watches shader file changes rebuilds shaders on the fly
4. Generates inputs for dynamically controlling uniforms/textures/attributes either manually or predefined bindings

## Installation
Go to releases and download vsix and example(optional)
https://github.com/mateuszmigas/webgl-shader-viewer/releases/

Open command palette in vscode and run "Extensions: Install from VSIX..."

## How to run
1. Open directory/workspace where you have glsl files (can be example project)
2. Open command palette in vscode and run "Open WebGL Shader Viewer"
3. Select vertex and fragment shaders

## Example shaders

# Vertex.hlsl
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

# Fragment.hlsl
```js
precision mediump float;
uniform vec3 u_reverseLightDirection;
uniform bool u_color;
uniform sampler2D uSampler;
varying vec3 v_normal;
varying highp vec2 vTextureCoord;

void main(){
    vec3 normal=normalize(v_normal);
    vec4 textureColor=texture2D(uSampler,vTextureCoord);
    float light=dot(normal,u_reverseLightDirection);
    gl_FragColor=vec4(light*textureColor.rgb,u_color);
}
```

### License

[MIT](https://choosealicense.com/licenses/mit/)
