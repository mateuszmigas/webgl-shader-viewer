
precision mediump float;
varying vec3 dupa2;
uniform vec3 u_dup1;
uniform vec4 u_dup2;

void main(){
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor=vec4(u_dup2.x,u_dup1.y,.5,1);// return redish-purple
}