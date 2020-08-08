const CELL_SIZE = 20;
const ROW_CELLS = 40;
const COL_CELLS = 40;
const GAP = 1;

let cells = new Array(ROW_CELLS);

function setup() {
	create_cells();
	createCanvas(windowWidth, windowHeight);
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
				fill(0);
			} else {
				fill(255);
			}
			rect(c * (CELL_SIZE + GAP), r * (CELL_SIZE + GAP), CELL_SIZE, CELL_SIZE);
		}
	}
}

// maybe use async instead of this 
function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

function draw() {
	background(30, 30, 30);
	step();
	draw_grid();
	//sleep(10);
}