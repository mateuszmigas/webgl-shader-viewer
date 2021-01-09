// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;
uniform vec4 u_color2;

void main(){
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor=u_color2;// return redish-purple
}