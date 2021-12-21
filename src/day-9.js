const { time } = require("console");
const fs = require("fs");

start();

async function start() {
	const body = fs.readFileSync("../data/day-9-input.txt", {
		encoding: "utf8",
		flag: "r",
	});

	// const body = `2199943210
	// 3987894921
	// 9856789892
	// 8767896789
	// 9899965678`;

	const cells = body.split("\n").map((item, index, arr) =>
		item
			.trim()
			.split("")
			.map((innerItem, innerIndex, row) => {
				innerItem = parseInt(innerItem);
				return new Cell(index, innerIndex, innerItem);
			})
	);
	// console.dir(cells, {
	// 	depth: 3,
	// });
	cells.map((row) =>
		row.map((cell) => {
			cell.cellsAround = findCellsAround(cell.i, cell.j, cells);
		})
	);
	const { lowestPoints, riskPoints } = findLowestPoints(cells);
	// console.log(lowestPoints);
	console.log(
		lowestPoints.reduce((acc, prev) => acc + prev.value + 1, 0),
		riskPoints
	);

    const basins = findBasins(lowestPoints).sort((a, b) => b.basinSize - a.basinSize);
    console.log(basins.splice(0, 3).reduce((acc, prev) => acc * prev.basinSize, 1))
}

function findBasins(lowestPoints) {
    for (let point of lowestPoints) {
        point.basin = findBasin(point, []);
        point.basinSize = point.basin.length;
        console.log(point.basinSize)
        // break;
    }
    // console.log(lowestPoints[0])
    return lowestPoints;
}

function findBasin(lowestPoint, basinIds) {
    // console.log("basin Ids:", basinIds)
    const basin = [];
    !basinIds.includes(`${lowestPoint.i}.${lowestPoint.j}`) && basinIds.push(`${lowestPoint.i}.${lowestPoint.j}`) && basin.push(lowestPoint);
	for (let cell of lowestPoint.cellsAround) {
		// console.log(cell.value, cell.isInBasin, `${cell.i}.${cell.j}`, basinIds, cell.value !== 9 && !cell.isInBasin && !basinIds.includes(`${cell.i}.${cell.j}`));
       
        if (cell.value !== 9 && !cell.isInBasin && !basinIds.includes(`${cell.i}.${cell.j}`)) {
            cell.isInBasin = true;
            basinIds.push(`${cell.i}.${cell.j}`);
			basin.push(cell, ...findBasin(cell, basinIds));
		}
	}
    // console.log(basin)
	return basin;
}

function findLowestPoints(cells) {
	let lowestPoints = [];
	let riskPoints = 0;
	for (let row of cells) {
		for (let cell of row) {
			let { min, max } = getMinMax([cell, ...cell.cellsAround], "value");
			// console.log(min, max, [cell, ...cell.cellsAround]   )
			if (cell.value === min.value && min.value !== cell.cellsAround.reduce((acc, prev) => acc + prev.value, 0) / cell.cellsAround.length) {
				cell.isLowest = true;
				riskPoints += cell.value + 1;
				lowestPoints.push(cell);
			}
		}
	}
	const nines = cells.map((row) => {
		row.filter((cell) => cell.isLowest && cell.value === 9);
	});
	console.log(nines);
	return {
		lowestPoints,
		riskPoints,
	};
}

function findCellsAround(i, j, array) {
	const cellsAround = [];
	const row = array[i];
	if (j > 0) {
		cellsAround.push(row[j - 1]);
	}
	if (j < row.length - 1) {
		cellsAround.push(row[j + 1]);
	}
	if (i > 0) {
		cellsAround.push(array[i - 1][j]);
	}
	if (i < array.length - 1) {
		cellsAround.push(array[i + 1][j]);
	}
	return cellsAround;
}

function Cell(i, j, value) {
	return {
		i,
		j,
		value,
		isLowest: false,
        isInBasin: false
	};
}

function getMinMax(arr, prop) {
	if (arr.length === 0) {
		return [];
	}
	let min = arr[0];
	let max = arr[0];
	let i = arr.length;

	while (i--) {
		min = arr[i][prop] < min[prop] ? arr[i] : min;
		max = arr[i][prop] > max[prop] ? arr[i] : max;
	}
	return { min, max };
}
