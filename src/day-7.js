const fs = require("fs");

start();

async function start() {
	const body = fs.readFileSync("../data/day-7-input.txt", {
		encoding: "utf8",
		flag: "r",
	});

	// const body = `16,1,2,0,4,2,7,1,2,14`;

	const array = body.split(",").map(item => parseInt(item)).sort((a, b) => a - b);
    
    const distances = getDistances(array, false);
    console.log("minimum distance:", getMinMax(Object.values(distances)))
}

function getDistance(length) {
    let distance = 0;
    if (length === 0) {
        return 0;
    }
    for (let i = 0; i <= length; i++) {
        distance += i;
    }
    return distance;
}

function getDistances(array, isSimple) {
    const { min, max } = getMinMax(array);
    const obj = {};
    for (let i = min; i <= max; i++) {
        for (let j = 0; j < array.length; j++) {
            if (!obj[i]) {
                obj[i] = 0;
            }
            if (isSimple) {
                obj[i] += Math.abs(array[j] - i);
            } else {
                obj[i] += getDistance(Math.abs(array[j] - i));
            }
        }
    }
    return obj;
}

function getDistancesBetweenAllNumbers(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length; j++) {
            let key = [array[i], array[j]].sort((a, b) => a - b).join("-");
            if (!obj[key]) {
                obj[key] = Math.abs(array[i] - array[j]);
            }
        }
    }
    return obj;
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


