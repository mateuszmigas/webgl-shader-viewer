precision mediump float;

// Passed in from the vertex shader.
varying vec3 v_normal;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;

void main(){
    // because v_normal is a varying it's interpolated
    // so it will not be a unit vector. Normalizing it
    // will make it a unit vector again
    vec3 normal=normalize(v_normal);
    
    float light=dot(normal,u_reverseLightDirection);
    
    gl_FragColor=texture2D(uSampler,vTextureCoord);
    
    // Lets multiply just the color portion (not the alpha)
    // by the light
    vec4 textureColor=texture2D(uSampler,vTextureCoord);
    gl_FragColor.rgb*=light;
    //gl_FragColor=textureColor;
}