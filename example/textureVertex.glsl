varying highp vec2 vTextureCoord;
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat4 uLocalToProjected4x4;

void main(void){
    gl_Position=uLocalToProjected4x4*aVertexPosition;
    vTextureCoord=aTextureCoord;
}