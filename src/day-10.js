const { time } = require("console");
const fs = require("fs");

const openingChars = ["[", "(", "{", "<"];
const points = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137
};

const autoCompletePoints = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4
}

start();


async function start() {
	const body = fs.readFileSync("../data/day-10-input.txt", {
		encoding: "utf8",
		flag: "r",
	});

	// const body = `[({(<(())[]>[[{[]{<()<>>
    // [(()[<>])]({[<{<<[]>>(
    // {([(<{}[<>[]}>{[]{[(<()>
    // (((({<>}<{<{<>}{[]{[]{}
    // [[<[([]))<([[{}[[()]]]
    // [{[{({}]{}}([{[{{{}}([]
    // {<[[]]>}<{[{[{[]{()[[[]
    // [<(<(<(<{}))><([]([]()
    // <{([([[(<>()){}]>(<<{{
    // <{([{{}}[<[[[<>{}]]]>[]]`;

	const array = body.split("\n").map((item) => item.trim());
	console.log(array);
    const corruptedChunks = [];
    const autoCompletePointsByLine = [];
    for (let line of array) {
        // let closingSequence = [];
        let processed = processLine2(line);
        if (processed.corrupted.length > 0) {
            corruptedChunks.push(processed.corrupted[0]);
        } else {
            console.log(processed)
            let closingSequence = identifyClosingSequence(processed.incomplete);
            console.log("closingSequence", closingSequence)
            autoCompletePointsByLine.push(closingSequence.reduce((acc, curr) => 5 * acc + autoCompletePoints[curr], 0));
        }
    }
    console.log("autoCompletePointsByLine", autoCompletePointsByLine.sort((a, b) => a - b)[parseInt(autoCompletePointsByLine.length / 2)])
    // processLine2("[({(<(())[]>[[{[]{<()<>>");
    // console.log("all corrupted:", corruptedChunks);
    console.log("points:", corruptedChunks.reduce((acc, curr) => acc + points[curr], 0))
}

function findMiddlePoint(array) {

}

function processLine2(line) {
    console.log("line:", line);
    const stack = [];
    const completeChunks = [];
    const corruptedChunks = [];
    const incompleteChunks = [];
    for (let i = 0; i < line.length; i++) {
        let char = line[i];
        stack.push(char);
        if (!openingChars.includes(char)) {
            
            let startChar = getStartChar(char);
            let firstStartChar = findFirstOpenChar(stack);

            let startCharIndex = stack.slice(0, stack.indexOf(char) + 1).lastIndexOf(startChar);
            let hasStartChar = startCharIndex > -1;
            if (hasStartChar && firstStartChar === startChar) {
                stack.splice(startCharIndex, 1);
                stack.splice(stack.lastIndexOf(char), 1);
                completeChunks.push(`${startChar}${char}`)
            } else {
                corruptedChunks.push(char);
            }
            
        }
    }
    // console.log("stack:", stack);
    // console.log("complete chunks:", completeChunks);
    // console.log("corrupted chunks:", corruptedChunks);
    // console.log(identifyClosingSequence(stack))
    return {
        corrupted: corruptedChunks,
        incomplete: stack,
        line
    }
}

function identifyClosingSequence(incomplete) {
    const closing = [];
    for (let i = incomplete.length - 1; i >= 0; i--) {
        let char = incomplete[i];
        closing.push(getEndChar(char))
    }
    return closing;
}

function findFirstOpenChar(subString) {
    // console.log("substring:", subString)
    let firstOpenChar = null;
    for (let i = subString.length; i >= 0; i--) {
        if (openingChars.includes(subString[i])) {
            firstOpenChar = subString[i];
            break;
        }
    }
    return firstOpenChar;
}

function processLine(line) {
	let shouldSkipNextTopLoopChar = false;
	const chunks = [];
	for (let i = 0; i < line.length; i++) {
		if (shouldSkipNextTopLoopChar) {
			continue;
		}
		shouldSkipNextTopLoopChar = false;
		let char = line[i];
		let hasEndChar = getEndChar(char) !== undefined;
		if (hasEndChar) {
			let chunk = processChunk(line, i);
			chunks.push(chunk);
		}
	}
	console.log(chunks);
}

function processChunk(line, startIndex) {
	let char = line[startIndex];
	console.log(line, startIndex, char);

	let chunk = new Chunk(char);
	for (let j = startIndex + 1; j < line.length; j++) {
		let nextChar = line[j];
		if (nextChar !== chunk.expectedEndChar) {
			let hasEndChar = getEndChar(nextChar) !== undefined;
			if (hasEndChar) {
				chunk.internalChunks.push(processChunk(line, j));
			}
		} else if (nextChar === chunk.expectedEndChar) {
			chunk.isValid = true;
			chunk.rawChunk = line.slice(startIndex, j);
			chunk.actualEndChar = nextChar;
		}
	}
	return chunk;
}

function Chunk(startChar) {
	const chunk = {
		startChar,
		rawChunk: startChar,
		expectedEndChar: getEndChar(startChar),
		actualEndChar: null,
		internalChunks: [],
		closedInternalChunks: 0,
		isValid: false,
		isClosed: false,
	};
	return chunk.expectedEndChar !== undefined ? chunk : null;
}

function getStartChar(endChar) {
    const chars = {
		"]": "[",
		")": "(",
		"}": "{",
		">": "<",
	};
	return chars[endChar];
}

function getEndChar(startChar) {
	const chars = {
		"[": "]",
		"(": ")",
		"{": "}",
		"<": ">",
	};
	return chars[startChar];
}
