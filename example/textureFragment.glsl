varying highp vec2 vTextureCoord;
uniform sampler2D uTexture;

void main(void){
    //gl_FragColor=vec4(texture2D(uTexture,vTextureCoord).xyz,0);
    gl_FragColor=vec4(1,0,0,1);
}