const fs = require("fs");

start();

async function start() {
	const body = fs.readFileSync("../data/day-1-input.txt", {
		encoding: "utf8",
		flag: "r",
	});
	const array = body.split("\n");
	const result = findSlidingWindow(array);
	console.log(result);
}

function findIncrease(array) {
	let increased = 0;
	for (let i = 0; i < array.length; i++) {
		if (i === 0) {
			continue;
		}
		if (parseInt(array[i]) > parseInt(array[i - 1])) {
			increased++;
		}
	}
	return increased;
}

function findSlidingWindow(array) {
    const measurementWindowCoefficient = 3;
    const windows = [];
    for (let i = 0; i < array.length; i++) {
        let temp = [];
        for (let j = 0; j < measurementWindowCoefficient; j++) {
            temp.push(parseInt(array[i + j]));
        }
        windows.push(temp.reduce((prev, cur) => prev + cur, 0));
    }
    return findIncrease(windows);
}
