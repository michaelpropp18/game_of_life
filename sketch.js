/*
let CELL_SIZE = 10;
let ROW_CELLS = 50;
let COL_CELLS = 50;
let SLEEP_TIME = 0;
*/
let ROW_CELLS = 70;
let COL_CELLS = 70;
let CELL_SIZE = Math.trunc(600 / ROW_CELLS);;
let SLEEP_TIME = 0;

let timer = 0;
let cells = new Array(ROW_CELLS);

function setup() {
	speed_slider = createSlider(0, 10, 10);
	speed_slider.position(20, 620);
	size_slider = createSlider(10, 100, 70);
	size_slider.position(210, 620);
	button = createButton('Generate');
	button.position(420, 620);
	button.mousePressed(generate);
	create_cells();
	createCanvas(windowWidth, windowHeight);
}

function draw_text() {
	fill(200);
	rect(10, 610, 520, 75, 5);
	textFont('Georgia');
	textSize(32);
	fill(255, 255, 255);
	fill(255, 255, 255);
	//text('Square Wave Fourier Series', 50, 50);
	textSize(16);
	fill(255);
	stroke(255);
	text('Speed: ' + speed_slider.value(), 50, 660);
	text('Grid Size: ' + size_slider.value() + ' X ' + size_slider.value(), 200, 660);
	fill(255, 0, 0);
	stroke(255, 0, 0);
	if (ROW_CELLS != size_slider.value()) {
		text('Click to update', 400, 660);
	}
}

function create_cells() {
	for (let r = 0; r < ROW_CELLS; r++) {
		cells[r] = new Array(COL_CELLS);
		for (let c = 0; c < COL_CELLS; c++) {
			if (Math.random() < 0.5) {
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
	CELL_SIZE = Math.trunc(600 / ROW_CELLS);
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

function mouseClicked() {
	print('the mouse was clicked');
	print(mouseX);
	print(mouseY);
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
				fill(0, 255, 0);
			} else {
				fill(0);
			}
			rect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
		}
	}
}

function draw() {
	if (millis() >= (-1 * speed_slider.value() * 100 + 1000) + timer) {
		background(0);
		fill(0);
		stroke(0);
		if (speed_slider.value() != 0) {
			step();
		}
		draw_grid();
		draw_text();
		timer = millis();
	}
}