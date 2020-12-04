console.log("fse");

{
  const element = document.getElementById("main-container");
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  element.appendChild(canvas);
  const context = canvas.getContext("2d");
  context.fillStyle = "red";
  context.fillRect(50, 50, 450, 450);
}
