precision mediump float;
uniform vec2 dupa2;
uniform vec3 dupa3;

void main(void){
    gl_FragColor=vec4(dupa3.x,dupa2.y,.5,1);// return redish-purple
}