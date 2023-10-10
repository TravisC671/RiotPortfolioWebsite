import { noise } from "@chriscourses/perlin-noise";

/*
let canvas = document.getElementById("intro-canvas");
const ctx = canvas.getContext("2d");

var width = canvas.offsetWidth;
var height = canvas.offsetHeight;

canvas.width = width;
canvas.height = height;

/*
1. create grid and assign vector
2. Generate Entities
*/

/*
let grid = [];

let gridSpaceX = 50;
let gridSpaceY = 50;

let noiseSize = 0.001;

let particleCount = 100;
let particles = [];

let velocityChangeTime = 0.1*/

/**
 * this creates a grid array with the proper size of the canvas.
 * each vector specifies length and rotation, or polar coordinates
 */
function generateGrid() {
	console.log(width / gridSpaceX);
	console.log(height / gridSpaceY);

	for (let x = 0; x < width; x += gridSpaceX) {
		let row = [];

		for (let y = 0; y < height; y += gridSpaceY) {
			let pointVector = [
				40,
				noise(x * noiseSize, y * noiseSize) * Math.PI * 2,
			];
			row.push(pointVector);
		}

		grid.push(row);
	}

	console.log(grid);
}

/**
 * this is for debug purposes, but helps tune values
 */
function drawGrid() {
	for (let i = 0; i < grid.length; i++) {
		let row = grid[i];

		for (let j = 0; j < row.length; j++) {
			let point = row[j];

			let directionX = point[0] * Math.cos(point[1]);
			let directionY = point[0] * Math.sin(point[1]);

			ctx.beginPath();
			ctx.moveTo(i * gridSpaceX, j * gridSpaceY);
			ctx.lineTo(
				i * gridSpaceX + directionX,
				j * gridSpaceY + directionY,
			);
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
	for (let i = 0; i < particleCount; i++) {
		let particle = {
			position: {
				x: getRandomInt(width),
				y: getRandomInt(height),
			},
			velocity: {
				r: 1,
				theta: 0,
			},
		};
		particles.push(particle);
	}
}

let lastTime = new Date().getTime();
let currentTime = 0;
let delta = 0;

function updateParticles() {
	currentTime = new Date().getTime();
	delta = (currentTime - lastTime) / 1000;

	for (let i = 0; i < particleCount; i++) {
		let selectedParticle = particles[i];
		//update velocity
		//get nearest grid point
		let gridPointX = Math.round(selectedParticle.position.x / gridSpaceX);
		let gridPointY = Math.round(selectedParticle.position.y / gridSpaceY);
		if (gridPointX < 0 || gridPointX > grid.length - 1) {
			continue;
		}
		if (gridPointY < 0 || gridPointY > grid[0].length - 1) {
			continue;
		}
		console.log("testx", gridPointX);
		console.log("testy", gridPointY);

		let point = grid[gridPointX][gridPointY];

		//gradually change the velocity based on the nearest gridpoint
		selectedParticle.velocity.theta = point[1];

		selectedParticle.position.x +=
			selectedParticle.velocity.r *
			Math.cos(selectedParticle.velocity.theta);
		selectedParticle.position.y +=
			selectedParticle.velocity.r *
			Math.sin(selectedParticle.velocity.theta);

		ctx.beginPath();
		ctx.arc(
			selectedParticle.position.x,
			selectedParticle.position.y,
			2,
			0,
			2 * Math.PI,
		);
		ctx.fill();
	}

	window.requestAnimationFrame(updateParticles);
}

class Particle {
	constructor(positionX, positionY, turnSmoothWeight, color, maxLength) {
		this.position = {
			x: positionX,
			y: positionY,
		};

		this.velocity = {
			r: 0,
			theta: 0,
		};

		this.turnSmoothWeight = turnSmoothWeight;
		this.color = color;
        this.maxLength = maxLength
		this.history = [{ x: this.position.x, y: this.position.y }];
	}

	draw(context) {
        this.history.push({x: this.position.x, y: this.position.y})

		let velocityX = this.velocity.r * Math.cos(this.velocity.theta);
		let velocityY = this.velocity.r * Math.sin(this.velocity.theta);
		this.position.x += velocityX;
		this.position.y += velocityY;

		context.strokeStyle = this.color;
		context.beginPath();
		context.moveTo(this.history[0].x, this.history[0].y);
		for (let i = 0; i < this.history.length; i++) {
            if (this.history[i].x == -1) {
                context.stroke()
                context.beginPath()
            } else {
                context.lineTo(this.history[i].x, this.history[i].y)
            }
        }

        if(this.history.length > this.maxLength) {
            this.history.shift();
        }

		context.stroke();
	}

	newPosition(positionX, positionY) {
		this.position = {
			x: positionX,
			y: positionY,
		};

		this.velocity = {
			r: 0,
			theta: 0,
		};

        this.history.push({ x: -1, y: -1 });
	}
}

class Effect {
	/**
	 * This class is the container for the effect.
	 * @param {HTMLCanvasElement} canvas canvas to draw the effect on
	 * @param {CanvasRenderingContext2D} ctx context for the canvas
	 * @param {number} width width of the canvas
	 * @param {number} height height of the canvas
	 * @param {number} gridSpaceX amount of cells in the X direction
	 * @param {number} gridSpaceY amount of cells in the Y direction
	 * @param {number} noiseSize the scale of the noise that is applied to the grid
	 * @param {boolean} debug this controls factors that help debug like drawing the grid
	 * @param {boolean} gridCells this controls factors that help debug like drawing the grid
	 */
	constructor(
		canvas,
		ctx,
		width,
		height,
		gridSpaceX = 50,
		gridSpaceY = 50,
		noiseSize = 0.001,
		numberOfParticles = 50,
		debug = false,
	) {
		this.canvas = canvas;
		this.ctx = ctx;

		this.width = width;
		this.height = height;

		this.gridSpaceX = gridSpaceX;
		this.gridSpaceY = gridSpaceY;

		this.noiseSize = noiseSize;

		this.debug = debug;

		/** @var {number[][][]} gridCells is a 3d array in which each cell stores polar coordinates */
		this.gridCells = [];

		this.particles = [];
		this.numberOfParticles = numberOfParticles;

		this.pallet = ["#E4E4E4", "#AFBDAC", "#68FF51"];

		this.generateGrid();
		this.generateParticles();
		if (debug) {
			this.drawGrid();
		}
	}

	generateGrid() {
		for (let y = 0; y < this.height; y += this.gridSpaceY) {
			let row = [];

			for (let x = 0; x < this.width; x += this.gridSpaceX) {
				let pointVector = [
					1,
					noise(x * this.noiseSize, y * this.noiseSize) * Math.PI * 2,
				];
				row.push(pointVector);
			}

			this.gridCells.push(row);
		}
	}

	generateParticles() {
		for (let i = 0; i < this.numberOfParticles; i++) {
			let color = this.pallet[getRandomInt(3)];
			this.particles.push(
				new Particle(
					getRandomInt(this.width),
					getRandomInt(this.height),
					.01,
					color,
                    getRandomInt(200) + 50
				),
			);
		}
	}

	drawGrid() {
		for (let i = 0; i < this.gridCells.length; i++) {
			let row = this.gridCells[i];

			for (let j = 0; j < row.length; j++) {
				let cell = row[j];

				let directionX = cell[0] * 20 * Math.cos(cell[1]);
				let directionY = cell[0] * 20 * Math.sin(cell[1]);

				this.ctx.beginPath();
				this.ctx.arc(
					j * this.gridSpaceX,
					i * this.gridSpaceY,
					2,
					0,
					Math.PI * 2,
				);
				this.ctx.fill();

				this.ctx.beginPath();
				this.ctx.moveTo(j * this.gridSpaceX, i * this.gridSpaceY);
				this.ctx.lineTo(
					j * this.gridSpaceX + directionX,
					i * this.gridSpaceY + directionY,
				);
				this.ctx.stroke();
			}
		}
	}

	render() {
        this.ctx.clearRect(0, 0, this.width, this.height)
        
        this.ctx.lineWidth = 10;
        this.ctx.lineCap = "round";
		
        this.particles.forEach((particle, index) => {
			let gridPointX = Math.round(particle.position.x / this.gridSpaceX);
			let gridPointY = Math.round(particle.position.y / this.gridSpaceY);

			if (gridPointX < 0 || gridPointX > this.gridCells[0].length - 1) {
				particle.newPosition(
					getRandomInt(this.width),
					getRandomInt(this.height),
				);
				gridPointX = Math.round(particle.position.x / this.gridSpaceX);
				gridPointY = Math.round(particle.position.y / this.gridSpaceY);
			}
			if (gridPointY < 0 || gridPointY > this.gridCells.length - 1) {
				particle.newPosition(
					getRandomInt(this.width),
					getRandomInt(this.height),
				);
				gridPointX = Math.round(particle.position.x / this.gridSpaceX);
				gridPointY = Math.round(particle.position.y / this.gridSpaceY);
			}

			let cell = this.gridCells[gridPointY][gridPointX];

			if (particle.velocity.theta != 0) {
				let targetTheta = cell[1];
				let currentTheta = particle.velocity.theta;
				//lerp(a, b, t) = a + (b-a) * t
				let resultTheta =
					currentTheta +
					(targetTheta - currentTheta) * particle.turnSmoothWeight;

				particle.velocity = {
					r: cell[0],
					theta: resultTheta,
				};
			} else {
				particle.velocity = {
					r: cell[0],
					theta: cell[1],
				};
			}

			particle.draw(this.ctx);
		});
	}
}

function drawIntroCanvas() {
	generateGrid();
	//drawGrid()
	generateParticles();
	updateParticles();
}

export { Effect };
