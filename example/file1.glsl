attribute vec4 a_position;
uniform vec2 u_dupeczka;
varying vec3 v_dupa;

// all shaders have a main function
void main(){
    
    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position=a_position;
    v_dupa=vec3(1,2,3);
}