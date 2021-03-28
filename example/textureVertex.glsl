varying highp vec2 vTextureCoord;
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat4 uCameraLocalToProjected4x4;

void main(void){
    gl_Position=uCameraLocalToProjected4x4*aVertexPosition;
    vTextureCoord=aTextureCoord;
}