const { time } = require("console");
const fs = require("fs");

start();

async function start() {
	try {
		const body = fs.readFileSync("../data/day-11-input.txt", {
			encoding: "utf8",
			flag: "r",
		});

		// const body = `5483143223
        // 2745854711
        // 5264556173
        // 6141336146
        // 6357385478
        // 4167524645
        // 2176841721
        // 6882881134
        // 4846848554
        // 5283751526`;

		const array = body.split("\n").map((row, rowIndex, octopuses) =>
			row
				.trim()
				.split("")
				.map((octopusEnergy, octopusIndex, rowArray) => {
					// console.log(row, row.length);
					return new DumboOctopus(octopusEnergy, rowIndex, octopusIndex, octopuses.length - 1, rowArray.length - 1);
				})
		);
		// console.dir(array, {
		// 	depth: 5,
		// });
		// console.log(array);
		processFlashes(array, 1000);
	} catch (e) {
		console.log("the error", e);
	}
}

function processFlashes(octopuses, steps) {
    console.log("before steps:\n")
    console.log(octopuses.map((row) => row.map((octo) => octo.energy).join(" ")).join("\n"));
	let totalFlashesCount = 0;
    let firstSyncedRow = null, i = 0;
	while (firstSyncedRow === null) {
        let flashedRows = 0;

		for (let row of octopuses) {
			for (let octopus of row) {
				octopus.energy++;
			}
		}
		let flashedOctopuses = octopuses.map((row) => row.filter((octopus) => octopus.energy > 9)).flat();
		// console.log("flashed: ", flashedOctopuses);
        
		for (let flashedOctopus of flashedOctopuses) {
			totalFlashesCount++;
            if (flashedOctopus.lastFlashedStep !== i) {
                flashedOctopus = processFlash(flashedOctopus, octopuses, i);
            }
            // console.log(flashedOctopus)
			// run through adjacent octopuses and raise their energy
			
		}
        flashedOctopuses = octopuses.map((row) => {
            let flashed = row.filter((octopus) => octopus.energy === 0);
            if (flashed.length === row.length) {
                flashedRows++;
            }
            return flashed;
        }).flat();

        if (firstSyncedRow === null && flashedRows === octopuses.length) {
            firstSyncedRow = i + 1;
        }
		console.log("\n");

		console.log("step", i);
		console.log("\n");
		console.log(octopuses.map((row) => row.map((octo) => octo.energy).join(" ")).join("\n"));
        i++;    
	}
	console.log("total flashes:", totalFlashesCount);
    console.log("total flashes 2:", octopuses.flat().reduce((acc, curr) => acc + curr.flashesCount, 0));
    console.log("firstSyncedRow", firstSyncedRow)
}

function processFlash(octopus, octopuses, step) {
	// console.log("octopus", octopus);
	// resetting energy before the next step
	octopus.energy = 0;
	// set a flag so that the octopus
	octopus.lastFlashedStep = step;
	// increase count
	octopus.flashesCount++;
    const flashedOctopus = octopuses[octopus.x][octopus.y];
    // console.log(flashedOctopus)
    for (let adjacentOctopusCoords of octopus.adjacentOctopuses) {
        // console.log(adjacentOctopusCoords)
        let adjacentOctopus = octopuses[adjacentOctopusCoords.x][adjacentOctopusCoords.y];
        
        // console.log(adjacentOctopus)
        if (adjacentOctopus.lastFlashedStep !== step) {
            adjacentOctopus.energy++;
        } 
        let processing = false;
        if (adjacentOctopus.energy > 9 && adjacentOctopus.lastFlashedStep !== step) {
            adjacentOctopus = processFlash(adjacentOctopus, octopuses, step);
        }

    }

	return octopus;
}

function DumboOctopus(startingEnergy, x, y, maxX, maxY) {
	return {
		energy: parseInt(startingEnergy),
		x,
		y,
		adjacentOctopuses: findadjacentOctopuses(x, y, maxX, maxY),
		flashesCount: 0,
		lastFlashedStep: null,
	};
}

function findadjacentOctopuses(x, y, maxX, maxY) {
	const adjacentOctopuses = [];
	if (x > 0) {
		adjacentOctopuses.push({
			x: x - 1,
			y,
		});
	}
	if (x < maxX) {
		adjacentOctopuses.push({
			x: x + 1,
			y,
		});
	}
	if (y > 0) {
		adjacentOctopuses.push({
			x,
			y: y - 1,
		});
	}
	if (y < maxY) {
		adjacentOctopuses.push({
			x,
			y: y + 1,
		});
	}
	if (x > 0 && y > 0) {
		adjacentOctopuses.push({
			x: x - 1,
			y: y - 1,
		});
	}
	if (x < maxX && y < maxY) {
		adjacentOctopuses.push({
			x: x + 1,
			y: y + 1,
		});
	}
	if (x > 0 && y < maxY) {
		adjacentOctopuses.push({
			x: x - 1,
			y: y + 1,
		});
	}
	if (x < maxX && y > 0) {
		adjacentOctopuses.push({
			x: x + 1,
			y: y - 1,
		});
	}
	return adjacentOctopuses;
}
