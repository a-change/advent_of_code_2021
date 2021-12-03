const fetch = require("node-fetch");
const fs = require("fs");

start();

async function start() {
	const body = fs.readFileSync("../data/day-3-input.txt", {
		encoding: "utf8",
		flag: "r",
	});

    // const body = `00100
    // 11110
    // 10110
    // 10111
    // 10101
    // 01111
    // 00111
    // 11100
    // 10000
    // 11001
    // 00010
    // 01010`
	const array = body.split("\n").map(item => item.trim());
    const oxygen = doTheSecondPart(array, "oxygen");
    const co2 = doTheSecondPart(array, "co2");
    console.log("co2 & oxygen:", parseInt(oxygen, 2) * parseInt(co2, 2));

    const mostAndLeastCommon = findMostAndLeastCommon(array);
    console.log("most common * least common:", mostAndLeastCommon.maxDecimal * mostAndLeastCommon.minDecimal);
}

function doTheSecondPart(array, type) {
    const arr = array.reduce((acc, curr, index, currentArray) => {
        if (acc.length === 1) {
            return acc;
        }
        const transposedArray = transposeArray(acc);
        let maxAndMin = new CountedArray(transposedArray[index]);
        let maxFilter = maxAndMin.maxAndMin.max.value === maxAndMin.maxAndMin.min.value ? 1 : maxAndMin.maxAndMin.max.element;
        let minFilter = maxAndMin.maxAndMin.max.value === maxAndMin.maxAndMin.min.value ? 0 : maxAndMin.maxAndMin.min.element;
        let temp = {
            oxygen: [],
            co2: []
        };
        for (let j of acc) {
            if (j[index] == maxFilter) {
                temp.oxygen.push(j);
            }
            if (j[index] == minFilter) {
                temp.co2.push(j);
            }
        }
        // console.log("temp oxygen:", temp.oxygen);
        return temp[type]
    }, array);
    return arr;
}


function findMostAndLeastCommon(array) {
    const transposedArray = transposeArray(array);
    const arrayData = [];
    let maxBinary = "", minBinary = "";
    for (let i of transposedArray) {
        let obj = new CountedArray(i);
        arrayData.push(obj);
        maxBinary += obj.maxAndMin.max.element;
        minBinary += obj.maxAndMin.min.element;
    }
    return {
        arrayData,
        maxBinary,
        minBinary,
        maxDecimal: parseInt( maxBinary, 2 ),
        minDecimal: parseInt( minBinary, 2 )
    };
}

function CountedArray(array) {
    const obj = {
        array,
        counts: countElements(array),
        maxAndMin: {},
    };
    obj.maxAndMin = findMaxAndMin(obj.counts);
    return obj;
}

function findMaxAndMin(counts) {
    let max = {
        value: 0,
        element: null
    }, 
    min = {
        value: 0,
        element: null
    }, 
    index = 0;
    for (let i in counts) {
        let count = parseInt(counts[i]);
        if (index === 0) {
            max.value = count;
            max.element = i;
            min.value = count;
            min.element = i;
        }
        if (count > max.value) {
            max.value = count;
            max.element = i;
        }
        if (count < min.value) {
            min.value = count;
            min.element = i;
        }
        index++;
    }
    return {
        max,
        min
    }
}

function transposeArray(array) {
    const transposedArray = []
    array.forEach((item, i) => {
        item = item.trim();
        for (let j = 0; j < item.length; j++) {
            let char = item[j].trim();
            if (!transposedArray[j]) {
                transposedArray[j] = [];
            }
            transposedArray[j].push(char);
        }
        
    });
    return transposedArray;
}

function countElements(array) {
    const elementsCounts = {};
    for (let i of array) {
        if (!elementsCounts[i]) {
            elementsCounts[i] = 0;
        }
        elementsCounts[i]++;
    }
    return elementsCounts;
}