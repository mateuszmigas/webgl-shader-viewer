precision mediump float;
varying lowp vec4 vColor;
uniform vec4 uColor;
void main(void){
    gl_FragColor=vColor;//vec4(uColor.x,1,1,1);
}