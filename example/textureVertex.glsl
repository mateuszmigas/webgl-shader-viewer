attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat4 uLocalToProjected4x4;
varying highp vec2 vTextureCoord;

void main(void){
    gl_Position=uLocalToProjected4x4*aVertexPosition;
    vTextureCoord=aTextureCoord;
}