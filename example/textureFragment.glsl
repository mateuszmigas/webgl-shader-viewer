precision mediump float;
varying highp vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform vec2 dupa;

void main(void){
    //gl_FragColor=vec4(texture2D(uTexture,vTextureCoord).xyz,0);
    gl_FragColor=vec4(dupa.x,0,0,1);
}