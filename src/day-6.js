const fs = require("fs");
const findLast = true;

start();

async function start() {
	const body = fs.readFileSync("../data/day-6-input.txt", {
		encoding: "utf8",
		flag: "r",
	});

	// const body = `3,4,3,1,2`;
	console.log("NUMBER: ", body);
	const numDays = 256;
	const array = body.split(",");
	// const array = body.split(",").map((item, index) => new Fish({ index, day: parseInt(item.trim()), shouldRunNextCycle: true, numDays: numDays, shouldCalculateAll: true }));
	const obj = group(array);
	console.log(obj);
	let total = 0;
	for (let key in obj) {
		let totalFish = calculateAllChildren(numDays, key, {}, {}, {});
		total += totalFish * obj[key];
	}
	console.log(total + array.length);
}

function group(array) {
	var obj = {};
	for (let fish of array) {
		if (!obj[fish]) {
			obj[fish] = 0;
		}
		obj[fish]++;
	}
	return obj;
}

function calculateAllChildren(numDays, startingDay, savedToReproduce, savedRecursions, savedCalculations) {
	let numChildren = 0;
	let toReproduce = 0;
	// calculate the number of children that current fish will give birth to
	if (!savedToReproduce[`${numDays}_${startingDay}`]) {
		toReproduce = calculateChildren(numDays, startingDay, true);
		savedToReproduce[`${numDays}_${startingDay}`] = toReproduce;
	} else {
		toReproduce = savedToReproduce[`${numDays}_${startingDay}`];
	}

	numChildren += toReproduce;
	if (!savedRecursions[`${numDays}_${toReproduce}_${startingDay}`]) {

		for (let i = 0; i < toReproduce; i++) {
			let internalChildren = 0;
			let childsNumDays = numDays - startingDay - 9 - 7 * i;

			// first child — account for necessary 8 days
			if (childsNumDays <= 0) {
				// console.log(`${indents.join("")}breaking`)
				break;
			}
			// recursively run the same function to determine other children
			if (!savedCalculations[childsNumDays]) {
				internalChildren++;
				let calculated = calculateAllChildren(childsNumDays, 0, savedToReproduce, savedRecursions, savedCalculations);
				internalChildren = internalChildren + calculated;
				savedCalculations[childsNumDays] = internalChildren;
			} else {
				internalChildren = savedCalculations[childsNumDays];
			}

			numChildren += internalChildren;
		}
		savedRecursions[`${numDays}_${toReproduce}_${startingDay}`] = numChildren;
	} else {
		numChildren = savedRecursions[`${numDays}_${toReproduce}_${startingDay}`];
	}

	return numChildren;
}

function calculateChildren(numDays, startingDay) {
	let toReproduce = 0; // number of fish to be born
	let basicNumberOfBirths = 0;

	// if the starting day is bigger than 0, it means there'll be at least one child fish
	if (startingDay > 0) {
		toReproduce++;
	}
	// get remaining days to base off further calculations on htem
	let remainingDays = numDays - startingDay;

	// if remaining days is not exactly divisible by 7, increase number of children by the whole part of the result of division
	if (remainingDays % 7 > 0) {
		basicNumberOfBirths = parseInt(remainingDays / 7);
	} else if (remainingDays % 7 === 0) {
		// if it's completely divisible, take result - 1 (because the child gets added on the next day)
		basicNumberOfBirths = parseInt(remainingDays / 7) - 1;
	}
	toReproduce += basicNumberOfBirths;
	return toReproduce;
}

function Fish(params) {
	const { index, day, shouldRunNextCycle, numDays, initialParent, directParent, shouldCalculateAll } = params;
	const basicNumberOfBirths = parseInt(numDays / 6);
	const remainingDays = numDays % 6;
	const toReproduce = parseInt(basicNumberOfBirths) + (remainingDays - day === 0 ? 1 : 0);
	// console.log(`day: ${day}, numDays: ${numDays}, basic number: ${basicNumberOfBirths}, calc: ${toReproduce}`)
	return {
		index,
		day,
		numDays,
		initialParent,
		directParent,
		shouldRunNextCycle,
		fishToReproduce: toReproduce,
		fishReproduced: 0,
		totalNumberOfChildren: calculateAllChildren(numDays, day, "initial", false, 0),
		calculatedChildren: 0,
	};
}

function updateDays() {}
