attribute vec3 a_position;
varying vec3 v_dupa;

// all shaders have a main function
void main(){
    
    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position=a_position;
    v_dupa=vec3(1,1,1);
}