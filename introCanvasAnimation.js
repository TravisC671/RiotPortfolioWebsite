import { noise } from '@chriscourses/perlin-noise'

let canvas = document.getElementById("intro-canvas")
const ctx = canvas.getContext("2d");

var width = canvas.offsetWidth;
var height = canvas. offsetHeight;

canvas.width = width;
canvas.height = height

/*
1. create grid and assign vector
2. Generate Entities
*/

let grid = []

let gridSpaceX = 50;
let gridSpaceY = 50;

let noiseSize = .001

let particleCount = 100
let particles = []

let velocityChangeTime = .1

/**
 * this creates a grid array with the proper size of the canvas.
 * each vector specifies length and rotation, or polar coordinates
 */
function generateGrid() {

    console.log(width/gridSpaceX)
    console.log(height/gridSpaceY)
    
    for (let x = 0; x < width; x += gridSpaceX) {
        
        let row = []
        
        for (let y = 0; y < height; y += gridSpaceY) {

            let pointVector = [40, noise(x * noiseSize, y * noiseSize) * Math.PI * 2]
            row.push(pointVector)
        }

        grid.push(row)
    }

    console.log(grid)
}

/**
 * this is for debug purposes, but helps tune values
 */
function drawGrid() {
    for (let i = 0; i < grid.length; i++) {
        
        let row = grid[i]
        
        for (let j = 0; j < row.length; j++) {
            let point = row[j]

            let directionX = point[0] * Math.cos(point[1])
            let directionY = point[0] * Math.sin(point[1])

            ctx.beginPath();
            ctx.moveTo(i * gridSpaceX, j * gridSpaceY);
            ctx.lineTo(i * gridSpaceX + directionX, j * gridSpaceY + directionY)
            ctx.stroke();
        }
    }
}

/**
 * from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param {int} max max number for random
 * @returns random number from 0 - max
 */

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function generateParticles() {
    for(let i = 0; i < particleCount; i++) {
        let particle = {
            position: {
                x: getRandomInt(width),
                y: getRandomInt(height)
            },
            velocity: {
                r: 1,
                theta: 0
            }
        }
        particles.push(particle)
    }
}

let lastTime = (new Date()).getTime()
let currentTime = 0
let delta = 0

function updateParticles() {
    currentTime = (new Date()).getTime();
    delta = (currentTime - lastTime) / 1000;

    for(let i = 0; i < particleCount; i++) {
        let selectedParticle = particles[i]
        //update velocity
        //get nearest grid point
        let gridPointX = Math.round(selectedParticle.position.x / gridSpaceX)
        let gridPointY = Math.round(selectedParticle.position.y / gridSpaceY)
        if (gridPointX < 0 || gridPointX > grid.length - 1) {
            continue
        }
        if (gridPointY < 0 || gridPointY > grid[0].length - 1) {
            continue
        }
        console.log('testx', gridPointX)
        console.log('testy', gridPointY)

        let point = grid[gridPointX][gridPointY]
        
        //gradually change the velocity based on the nearest gridpoint
        selectedParticle.velocity.theta = point[1]

        selectedParticle.position.x += selectedParticle.velocity.r * Math.cos(selectedParticle.velocity.theta)
        selectedParticle.position.y += selectedParticle.velocity.r * Math.sin(selectedParticle.velocity.theta)

        
        
        ctx.beginPath();
        ctx.arc(selectedParticle.position.x, selectedParticle.position.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    window.requestAnimationFrame(updateParticles)
}

class Effect {
    /**
     * This class is the container for the effect.
     * @param {number} width width of the canvas
     * @param {number} height height of the canvas
     * @param {number} gridSpaceX amount of cells in the X direction
     * @param {number} gridSpaceY amount of cells in the Y direction
     * @param {number} noiseSize the scale of the noise that is applied to the grid
     */
    constructor(width, height, gridSpaceX = 50, gridSpaceY = 50, noiseSize = 0.001) {
        this.width = width;
        this.height = height;
        
        this.gridSpaceX = gridSpaceX;
        this.gridSpaceY = gridSpaceY;

        this.noiseSize = noiseSize;

        this.gridCells = []
    }
    generateGrid() {
        for(let y = 0; y < this.height; y++) {
            
            let row = []

            for(let x = 0; x < this.width; x++) {
                let pointVector = [40, noise(x * noiseSize, y * noiseSize) * Math.PI * 2]
                row.push
            }
        }
    }
}

let test = new Effect(canvas.width, canvas.height)

function drawIntroCanvas() {
    generateGrid()
    //drawGrid()
    generateParticles()
    updateParticles()
}

export {drawIntroCanvas}