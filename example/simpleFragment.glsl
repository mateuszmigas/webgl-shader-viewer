precision mediump float;

varying vec3 v_normal;
varying highp vec2 vTextureCoord;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;
uniform sampler2D uSampler;

void main(){
    vec3 normal=normalize(v_normal);
    
    float light=dot(normal,u_reverseLightDirection);
    
    gl_FragColor=texture2D(uSampler,vTextureCoord);
    
    vec4 textureColor=texture2D(uSampler,vTextureCoord);
    gl_FragColor.rgb*=light;
}