precision mediump float;
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 extracolor;

void main(void){
    vec4 textureColor=texture2D(uSampler,vTextureCoord);
    gl_FragColor=vec4(textureColor.x,textureColor.y,extracolor.z,1);
}