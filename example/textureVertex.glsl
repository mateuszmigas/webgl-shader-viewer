attribute vec4 a_position;
uniform mat4 uLocalToProjected4x4;

void main(void){
    gl_Position=uLocalToProjected4x4*a_position;
}