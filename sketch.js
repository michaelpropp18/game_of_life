let ROW_CELLS; // number of rows in the grid
let COL_CELLS; // number of cols in the grid
let CELL_SIZE; // size of a cell in pixels

let timer = 0; // timer used to update draw()
let cells = new Array(ROW_CELLS); // grid of cells

let paused = false; // determines if user can draw

let pause_button;
let generate_button;

const START_HEIGHT = 75; // gap between top of screen and start of grid in pixels
const DESIRED_HEIGHT = 600; // desired height / width of grid in pixels

function setup() {
	// set up sliders
	size_slider = createSlider(10, 100, 50);
	size_slider.style('width', '200px');
	size_slider.position(23 + DESIRED_HEIGHT, START_HEIGHT + 60);

	// set up radio buttons
	create_radio = createRadio();
	create_radio.option('Random');
	create_radio.option('Blank');
	create_radio.value('Random'); // default value
	create_radio.position(50 + DESIRED_HEIGHT, START_HEIGHT + 130);

	draw_radio = createRadio();
	draw_radio.option('Draw');
	draw_radio.option('Erase');
	draw_radio.value('Draw'); // default value
	draw_radio.position(55 + DESIRED_HEIGHT, START_HEIGHT + 300);

	// buttons
	pause_button = createButton('Pause');
	pause_button.style('width', '150px');
	pause_button.style('height', '30px');
	pause_button.position(50 + DESIRED_HEIGHT, START_HEIGHT + 390);
	pause_button.mousePressed(pause);

	resume_button = createButton('Resume');
	resume_button.style('width', '150px');
	resume_button.style('height', '30px');
	resume_button.position(50 + DESIRED_HEIGHT, START_HEIGHT + 390);
	resume_button.mousePressed(resume);
	resume_button.hide();

	generate_button = createButton('Generate');
	generate_button.position(50 + DESIRED_HEIGHT, START_HEIGHT + 170);
	generate_button.style('width', '150px');
	generate_button.style('height', '30px');
	generate_button.mousePressed(generate);

	generate();
	createCanvas(windowWidth, windowHeight);
}

function pause() {
	if (!paused) {
		paused = true;
		pause_button.hide();
		resume_button.show();
	}
}

function resume() {
	if (paused) {
		paused = false;
		resume_button.hide();
		pause_button.show();
	}
}

function draw_text() {
	// draw title
	textFont('Georgia');
	textSize(32);
	fill(255);
	text('Conway\'s Game of life', 140, 50);

	// draw bottom toolbar rectangle
	rect(5 + DESIRED_HEIGHT, START_HEIGHT, 240, 240, 5);
	rect(5 + DESIRED_HEIGHT, START_HEIGHT + 250, 240, 90, 5);
	rect(5 + DESIRED_HEIGHT, START_HEIGHT + 350, 240, 100, 5);

	//generate new simulation
	fill(0);
	stroke(255);
	textSize(20);
	text('Generate New Simulation', 12 + DESIRED_HEIGHT, START_HEIGHT + 22);
	textSize(16);
	fill(0);
	stroke(255);
	text('Grid Size: ' + size_slider.value() + ' X ' + size_slider.value(), 60 + DESIRED_HEIGHT, START_HEIGHT + 100);

	//draw
	textSize(20);
	text('Drawing', 88 + DESIRED_HEIGHT, START_HEIGHT + 275);

	//generate new simulation
	textSize(20);
	text('Controls', 90 + DESIRED_HEIGHT, START_HEIGHT + 375);

	//instructions
	fill(255);
	text('Click on a square to draw', 180, 35 + START_HEIGHT + DESIRED_HEIGHT);

}

function create_cells() {
	for (let r = 0; r < ROW_CELLS; r++) {
		cells[r] = new Array(COL_CELLS);
		for (let c = 0; c < COL_CELLS; c++) {
			if (create_radio.value() == 'Random' && Math.random() < 0.5) {
				cells[r][c] = 1;
			} else {
				cells[r][c] = 0;
			}
		}
	}
}

function generate() {
	ROW_CELLS = size_slider.value();
	COL_CELLS = size_slider.value();
	CELL_SIZE = Math.trunc(DESIRED_HEIGHT / ROW_CELLS);
	create_cells();
}

function step() {
	let new_cells = new Array(ROW_CELLS);
	for (let r = 0; r < ROW_CELLS; r++) {
		new_cells[r] = new Array(COL_CELLS);
		for (let c = 0; c < COL_CELLS; c++) {
			let count = neighbor_count(r, c);
			if (cells[r][c] == 1 && count >= 2 && count <= 3) { //Any live cell with two or three live neighbours survives.
				new_cells[r][c] = 1;
			} else if (cells[r][c] == 0 && count == 3) { //Any dead cell with three live neighbours becomes a live cell.	
				new_cells[r][c] = 1;
			} else { //All other live cells die in the next generation. Similarly, all other dead cells stay dead.
				new_cells[r][c] = 0;
			}
		}
	}
	for (let r = 0; r < ROW_CELLS; r++) {
		for (let c = 0; c < COL_CELLS; c++) {
			cells[r][c] = new_cells[r][c];
		}
	}
}

function mouseDragged() {
	mouseClicked();
}

function mouseClicked() {
	let row = Math.trunc((mouseY - START_HEIGHT) / CELL_SIZE);
	let col = Math.trunc((mouseX) / CELL_SIZE);
	if (row >= 0 && row < ROW_CELLS && col >= 0 && col < COL_CELLS) {
		if (!paused) {
			pause();
		} 
		if (draw_radio.value() == 'Draw') {
			cells[row][col] = 1;
		} else {
			cells[row][col] = 0;
		}
	}
}

function neighbor_count(r, c) {
	let count = 0;
	for (let i = r - 1; i <= r + 1; i++) {
		for (let j = c - 1; j <= c + 1; j++) {
			if (i >= 0 && j >= 0 && i < ROW_CELLS && j < COL_CELLS && (r != i || c != j)) {
				count += cells[i][j];
			}
		}
	}
	return count;
}

function draw_grid() {
	for (let r = 0; r < ROW_CELLS; r++) {
		for (let c = 0; c < COL_CELLS; c++) {
			if (cells[r][c] == 1) {
				fill(255);
			} else {
				fill(40);
			}
			rect(c * CELL_SIZE, START_HEIGHT + r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
		}
	}
}

function draw() {
	background(0);
	fill(0);
	stroke(0);
	if (!paused) {
		step();
	}
	draw_grid();
	draw_text();
	timer = millis();
}