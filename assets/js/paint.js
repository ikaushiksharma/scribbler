import { getSocket } from "./sockets";

const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
const colorOptions = Array.from(document.getElementsByClassName("color-option"));
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round"
let isPainting = false;
let isFilling = false;

const beginPath = (x, y) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
}

const strokePath = (x, y, color = null) => {
  let currentColor = ctx.strokeStyle; 
  if (color !== null) {
    ctx.strokeStyle = color;
  }
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.strokeStyle = currentColor;
}

function onMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  if(isPainting){
    strokePath(x, y)
    getSocket().emit(window.events.strokePath, {x, y, color: ctx.strokeStyle})
    return;
  }
  beginPath(x, y);
  getSocket().emit(window.events.beginPath, {x, y})
}

function startPainting() {
  isPainting = true;
}

function cancelPainting() {
  isPainting = false;
}

function onLineWidthChange(event) {
  //console.log(event);
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event){

  const colorValue = event.target.dataset.color; 
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue; 
}

function onModeClick(){
  if(isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

const fill = (color = null ) => {
  let currentColor = ctx.fillStyle;
  if(color !== null){
    ctx.fillStyle = color;
  }
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = currentColor
}

function onCavasClick() {
  if(isFilling){
    fill();
    getSocket().emit(window.events.fill, { color: ctx.fillStyle })
  }
}

function onDestroyClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image(); 
  image.src = url;
  image.onload = function() {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  }
}

function onDoubleClick(event) {
  const text = textInput.value;

  if (text !== "") {  
    ctx.save(); 
    
    ctx.lineWidth = 1;
    ctx.font = "48px serif"; 
    ctx.fillText(text, event.offsetX, event.offsetY);
    
    ctx.restore();  
  }
}

function onSaveClick() {
  const url = canvas.toDataURL();

  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}

canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCavasClick);

lineWidth.addEventListener('change', onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach(color => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);

export const handleBeganPath = ({x, y}) => beginPath(x, y)
export const handleStrokedPath = ({x, y, color}) => strokePath(x, y, color);
export const handleFilled = ({color}) => fill(color);