attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uLocalToProjected4x4;
varying lowp vec4 vColor;

void main(void){
    //gl_Position=uProjectionMatrix*uModelViewMatrix*aVertexPosition;
    gl_Position=uLocalToProjected4x4*aVertexPosition;
    vColor=aVertexColor;
}