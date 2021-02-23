varying highp vec2 vTextureCoord;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
void main(void){
    gl_FragColor=vec4(texture2D(uTexture1,vTextureCoord).xy,texture2D(uTexture2,vTextureCoord).z,0);
}