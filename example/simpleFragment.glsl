precision mediump float;

// Passed in from the vertex shader.
varying vec3 v_normal;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

void main(){
    // because v_normal is a varying it's interpolated
    // so it will not be a unit vector. Normalizing it
    // will make it a unit vector again
    vec3 normal=normalize(v_normal);
    
    float light=dot(normal,u_reverseLightDirection);
    
    gl_FragColor=u_color;
    
    // Lets multiply just the color portion (not the alpha)
    // by the light
    gl_FragColor.rgb*=light;
}