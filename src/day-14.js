const { time } = require("console");
const { getMinMax } = require("./helping-functions");
const fs = require("fs");

start();

async function start() {
	try {
		const body = fs.readFileSync("../data/day-14-input.txt", {
			encoding: "utf8",
			flag: "r",
		});
 
		// const body = `NNCB

        // CH -> B
        // HH -> N
        // CB -> H
        // NH -> C
        // HB -> C
        // HC -> B
        // HN -> C
        // NN -> C
        // BH -> H
        // NC -> B
        // NB -> B
        // BN -> B
        // BB -> N
        // BC -> B
        // CC -> N
        // CN -> C`;
		let polymer = "";
		const rules = body.split("\n").reduce(function (acc, line, index) {
			line = line.trim();
			if (index === 0) {
				polymer = line;
				return {};
			}
			if (line.length === 0) {
				return {};
			}
			const rule = new Rule(line);
			acc[rule.combination] = rule;
			return acc;
		}, {});

        const steps = 40;
        let newPolymer = polymer;
        let polymerObj = convertPolymerToObj(polymer);
        console.log("polymerObj:", polymerObj, "\n")
        for (let i = 0; i < steps; i++) {
            console.log("step ", i)
            // newPolymer = updatePolymer(newPolymer, rules);
            polymerObj = updatePolymer2(polymerObj, rules);
        }

        const counts = countLetters2(polymerObj);
        const { min, max } = getMinMax(counts.map(item => item[1]));
        console.log(`counts: ${counts}, \nmin: ${min}, \nmax: ${max}, \n(max - min): ${max - min}`);
        console.log(sumObj(polymerObj));
	} catch (e) {
		console.log("the error", e);
	}
}

function sumObj(obj) {
    let sum = 0;
    for (let key in obj) {
        if (typeof obj[key] !== "number") {
            continue;
        }
        sum += obj[key];
    }
    return sum;
}

function countLetters2(polymerObj) {
    const counts = {}, array = [];
    for (let key in polymerObj) {
        if (key === "lastLetter") {
            continue;
        }
        console.log(key)
        counts[key[0]] = (counts[key[0]] || 0) + polymerObj[key];
        // counts[key[1]] = (counts[key[1]] || 0) + polymerObj[key];
    }
    counts[polymerObj.lastLetter]++;
    console.log(counts);
    for (let key in counts) {
        array.push([key, counts[key]]);
    }
    return array;
}

function convertPolymerToObj(polymer) {
    const polymerObj = {};
    for (let i = 0; i < polymer.length; i++) {
        if (i === polymer.length - 1) {
            continue;
        }
        let combination = polymer[i] + polymer[i + 1];
        polymerObj[combination] = (polymerObj[combination] || 0) + 1;
    }
    return polymerObj;
}

function updatePolymer2(polymerObj, rules) {
    const newPolymerObj = {};
    let i = 0;
    console.log("input polymer obj", polymerObj);
    for (let key in polymerObj) {
        
        if (key === "lastLetter") {
            continue;
        }

        let updatedCombination1 = key[0] + rules[key].valueToInsert;
        let updatedCombination2 = rules[key].valueToInsert + key[1];

        newPolymerObj[updatedCombination1] = newPolymerObj[updatedCombination1] ? newPolymerObj[updatedCombination1] + polymerObj[key]: polymerObj[key];
        newPolymerObj[updatedCombination2] = newPolymerObj[updatedCombination2] ? newPolymerObj[updatedCombination2] + polymerObj[key] : polymerObj[key];


        newPolymerObj.lastLetter = key[1];
        
        i++;
    }

    return newPolymerObj
}

function updatePolymer(polymer, rules) {
    let newPolymer = "";
    for (let i = 0; i < polymer.length; i++) {
        if (i === polymer.length - 1) {
            newPolymer += polymer[i];
            continue;
        }
        let combination = polymer[i] + polymer[i + 1];
        newPolymer += polymer[i] + rules[combination].valueToInsert;

    }
    return newPolymer;
}

function countLetters(polymer) {
    console.log(polymer)
    let counts = {}, array = [];
    for (let letter of polymer) {
        if (!counts.hasOwnProperty(letter)) {
            counts[letter] = 1;
        } else {
            counts[letter]++;
        }
    }
    console.log(counts)
    for (let key in counts) {
        array.push([key, counts[key]]);
    }
    return array;
}

function Rule(rawRule) {
	rawRule = rawRule.split(" -> ");
	return {
		combination: rawRule[0],
		valueToInsert: rawRule[1],
	};
}
