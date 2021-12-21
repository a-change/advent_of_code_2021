const { time } = require("console");
const { getMinMax } = require("./helping-functions");
const fs = require("fs");

start();

async function start() {
	try {
		const body = fs.readFileSync("../data/day-13-input.txt", {
			encoding: "utf8",
			flag: "r",
		});

		// const body = `6,10
        // 0,14
        // 9,10
        // 0,3
        // 10,4
        // 4,11
        // 6,0
        // 6,12
        // 4,1
        // 0,13
        // 10,12
        // 3,4
        // 3,0
        // 8,4
        // 1,10
        // 2,14
        // 8,10
        // 9,0
        
        // fold along y=7
        // // fold along x=5`;

        // const body = `0,0
        // 1,1
        // 2,2
        // 3,3
        // 0,6
        // 1,7
        // 2,8
        // 3,9

        // fold along y=5
        // fold along x=5`;

        const foldingRules = [];
        const coordinates = body.split("\n").map(line => {
            line = line.trim();
            if (line.includes("fold")) {
                foldingRules.push(new FoldingRule(line));
                return null;
            }
            if (line.length === 0) {
                return null;
            }
            const coordinates = line.split(",");
            
            // console.log(coordinates);
            return coordinates.map(item => parseInt(item)).flat();
        }).filter(item => item !== null);
        const xBoundaries = getMinMax(coordinates.map(item => item[0]));
        const yBoundaries = getMinMax(coordinates.map(item => item[1]));
        const grid = [];
        for (let i = 0; i < yBoundaries.max + 1; i++) {
            let array = [];
            for (let j = 0; j < xBoundaries.max + 1; j++) {
                array[j] = ".";
            }
            grid[i] = array;
        }
        for (let coord of coordinates) {
            // console.log(coord[1], coord[0], grid[coord[1]])
            grid[coord[1]][coord[0]] = "x";
        }

		// console.log(coordinates);
        // console.log(foldingRules);

        let folded = grid;
        let i = foldingRules.length;
        for (let foldingRule of foldingRules) {
            if (i < 10) {
                console.log(i, "\n", foldingRule, "\n")
                console.log(displayArray(folded));
            }
            folded = foldArray(folded, foldingRule);
            console.log("rule", foldingRule)
            
            i--;
        }
        console.log("\nFolded by cycle:")
        console.log(displayArray(folded));
        console.log("total x:", folded.reduce((acc, curr) => {
            return acc + curr.reduce((intAcc, intCurr) => intAcc + (intCurr === "x" ? 1 : 0), 0)
        }, 0));
        console.log(calculate(folded, "x"))
	} catch (e) {
		console.log("the error", e);
	}
}

function displayArray(array) {
    return array.map(item => item.join(" ").replace(/\./g, " ")).join("\n")
}

function foldArray(array, foldingRule) {
    return foldingRule.axis === "x" ? foldInX(array, foldingRule.lineNumber) : foldInY(array, foldingRule.lineNumber);
}

function calculate(array, char) {
    let sum = 0;
    for (let i of array) {
        for (let j of i) {
            if (j === char) {
                sum++;
            }
        }
    }
    return sum;
}

function foldInXOther(array, line) {
    const arrays = [];
    for (let i = 0; i < array.length; i++) {
        let baseArray = [];
        for (let j = 0; j < array[i].length; j++) {
            if (array[i][j] === "x" && j > line) {
                baseArray[line - (j - line)] = "x";
            } else if (line > j) {
                baseArray[j] = array[i][j];
            }
        }
        arrays.push(baseArray);
        
    }
    return arrays;
}

function foldInYOther(array, line) {
    console.log("folding in y")
    const baseArray = [];
    for (let i = 0; i < array.length; i++) {
        if (i < line) {
            baseArray[i] = array[i];
        }
        for (let j = 0; j < array[i].length; j++) {
            if (array[i][j] === "x" && i > line) {
                baseArray[line - (i - line)][j] = "x";
            }
        }
        
    }
    // console.log(foldedArray.length, baseArray.length)
    return baseArray;
}

function foldInX(array, line) {
    const arrays = [];
    for (let i = 0; i < array.length; i++) {
        let baseArray = array[i].slice(0, line);
        let foldedArray = array[i].slice(line + 1, array[i].length);
        for (let j = 0; j < foldedArray.length; j++) {
            if (foldedArray[j] === "x") {
                baseArray[foldedArray.length - j - 1] = "x";
            }
        }
        arrays.push(baseArray);
        
    }
    return arrays;
}

function foldInY(array, line) {
    console.log("folding in y")
    const baseArray = array.slice(0, line);
    const foldedArray = array.slice(line + 1, array.length);
    for (let i = 0; i < foldedArray.length; i++) {
        for (let j = 0; j < foldedArray[i].length; j++) {
            if (foldedArray[i][j] === "x") {
                foldedArray.length !== line && console.log(`foldedArray.length: ${foldedArray.length}, line: ${line}`)
                baseArray[line - i - 1][j] = "x";
            }
        }
        
    }
    // console.log(foldedArray.length, baseArray.length)
    return baseArray;
}

function FoldingRule(rawRule) {
    const data = rawRule.match(/fold along (\w)=(\d+)/);
    return {
        axis: data[1],
        lineNumber: parseInt(data[2])
    }
}