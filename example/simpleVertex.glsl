attribute vec4 a_position;
attribute vec3 a_normal;

uniform mat4 u_matrix;

varying vec3 v_normal;
attribute vec2 aTextureCoord;
varying highp vec2 vTextureCoord;

void main(){
    // Multiply the position by the matrix.
    gl_Position=u_matrix*a_position;
    
    // Pass the normal to the fragment shader
    v_normal=a_normal;
    vTextureCoord=aTextureCoord;
}