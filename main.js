import { Effect } from "./introCanvasAnimation";

let introCanvas = document.getElementById("intro-canvas");
const ctx = introCanvas.getContext("2d");

var width = introCanvas.offsetWidth;
var height = introCanvas.offsetHeight;

introCanvas.width = width;
introCanvas.height = height;


let introEffect = new Effect(introCanvas, ctx, width, height, 20, 20, .0009, 200, true)

function renderIntroCanvas() {
    introEffect.render()
    window.requestAnimationFrame(renderIntroCanvas)
}

window.requestAnimationFrame(renderIntroCanvas)
