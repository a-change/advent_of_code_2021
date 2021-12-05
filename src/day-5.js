const fs = require("fs");
const findLast = true;

start();

async function start() {
	// const body = fs.readFileSync("../data/day-5-input.txt", {
	// 	encoding: "utf8",
	// 	flag: "r",
	// });

	const body = `0,9 -> 5,9
    8,0 -> 0,8
    9,4 -> 3,4
    2,2 -> 2,1
    7,0 -> 7,4
    6,4 -> 2,0
    0,9 -> 2,9
    3,4 -> 1,4
    0,0 -> 8,8
    5,5 -> 8,2`;

	const array = body.split("\n").map((item) => item.trim());
	const lines = initLines(array);
	// console.log(lines);
	const grid = initGrid(lines);
	// console.log(grid);
    console.log(lines.lines.filter(line => !line.isDiagonal).length, lines.lines.filter(line => line.isDiagonal).length, lines.lines.length);
	runThroughGrid(grid, lines.lines.filter(line => line), 2);
}

function initGrid(lines) {
	const grid = new Grid(lines.minX, lines.maxX, lines.minY, lines.maxY);
	return grid;
}

function runThroughGrid(grid, lines, minOverLapLimit) {
    let numberOfOverlappingPoints = 0;
    let overlappingLines = [];
    let output = "";
	for (let row of grid) {
		for (let cell of row) {
            let linesInCell = getLinesThatPassCell(cell, lines);
			cell.lines = linesInCell.length;
			if (cell.lines > 0) {
				cell.value = cell.lines.toString();
			} 
            if (cell.lines >= minOverLapLimit) {
                numberOfOverlappingPoints++;
                overlappingLines.push({
                    cell,
                    linesInCell
                })
            }
			output += cell.value;
		}
		output += "\n";
	}
    console.log(output);
    console.dir(overlappingLines.filter(line => line.cell.lines > 2).length, {
        depth: 4
    })
    console.log("numberOfOverlappingPoints:", numberOfOverlappingPoints);
}

function getLinesThatPassCell(cell, lines) {
	return lines.filter((line) => { 
        let response = (cell.x >= line.minX && cell.x <= line.maxX) && (cell.y >= line.minY && cell.y <= line.maxY);
        if (line.isDiagonal) {
            response = response && isAngle45({
                x: line.start.x,
                y: line.start.y
            }, {
                x: cell.x,
                y: cell.y
            });
        } 
        return response;
    });
}


function isAngle45(start, end) {
    let is45 = false;
    if (Math.abs(end.x - start.x) === Math.abs(end.y - start.y)) {
        is45 = true;
    }
    return is45;
}

function Grid(minX, maxX, minY, maxY) {
	const grid = [];
	for (let i = minY; i <= maxY; i++) {
        let row = [];
		for (let j = minX; j <= maxX; j++) {
			row.push(new Cell(j, i));
		}
        grid.push(row);
	}
	return grid;
}

function Cell(x, y) {
	return {
		value: ".",
		x,
		y,
		lines: 0,
	};
}

function initLines(array) {
	const x = [],
		y = [];
	const lines = array.map((rawLine) => {
		const line = new Line(rawLine);
		x.push(line.start.x, line.end.x);
		y.push(line.start.y, line.end.y);
		return line;
	});
	const minMaxX = getMinMax(x);
	const minMaxY = getMinMax(y);
	return {
		lines,
		minX: minMaxX.min,
		maxX: minMaxX.max,
		minY: minMaxY.min,
		maxY: minMaxY.max,
	};
}

function Line(rawLine) {
	const splitLine = rawLine.split(" -> ");
	const start = splitLine[0].split(",");
	const end = splitLine[1].split(",");
	const line = {
		minX: 0,
		maxX: 0,
		minY: 0,
		maxY: 0,
		start: {
			x: parseInt(start[0]),
			y: parseInt(start[1]),
		},
		end: {
			x: parseInt(end[0]),
			y: parseInt(end[1]),
		},
		isDiagonal: false,
	};
	const xAbs = getMinMax([line.start.x, line.end.x]);
	const yAbs = getMinMax([line.start.y, line.end.y]);
	line.minX = xAbs.min;
	line.maxX = xAbs.max;
	line.minY = yAbs.min;
	line.maxY = yAbs.max;
	if (line.start.x !== line.end.x && line.start.y !== line.end.y) {
		line.isDiagonal = true;
	}
	return line;
}

function getMinMax(arr) {
	let min = arr[0];
	let max = arr[0];
	let i = arr.length;

	while (i--) {
		min = arr[i] < min ? arr[i] : min;
		max = arr[i] > max ? arr[i] : max;
	}
	return { min, max };
}
