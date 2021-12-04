const fs = require("fs");
const findLast = true;

start();

async function start() {
	const body = fs.readFileSync("../data/day-4-input.txt", {
		encoding: "utf8",
		flag: "r",
	});

	// const body = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

	// 22 13 17 11  0
	// 8  2 23  4 24
	// 21  9 14 16  7
	// 6 10  3 18  5
	// 1 12 20 15 19

	// 3 15  0  2 22
	// 9 18 13 17  5
	// 19  8  7 25 23
	// 20 11 10 24  4
	// 14 21 16 12  6

	// 14 21 17 24  4
	// 10 16 15  9 19
	// 18  8 23 26 20
	// 22 11 13  6  5
	// 2  0 12  3  7`;

	const array = body.split("\n\n").map((item) => item.trim());
	const drawnNumbers = array[0].split(",").map((item) => parseInt(item));
	const boards = array
		// get all items but first
		.map((item, index) => {
			if (index > 0) return item;
		})
		// remove the empty one (first)
		.filter((item) => !!item)
		// split them into arrays by new line and then split each element of the resulting array into another array by a blank space
		.map(
			(item) =>
				new Board(
					item.split("\n").map((item) =>
						item
							.trim()
							.replace(/\s+/g, " ")
							.split(" ")
							.map((item) => parseInt(item))
					)
				)
		);
	const result = drawNumbers(drawnNumbers, boards);
	const sumOfUnmarked = result.unmarkedNumbers.reduce((a, b) => a + b, 0);
	console.dir(result, {
		depth: 3,
		colors: true,
	});
	console.log("sum of unmarked:", sumOfUnmarked);
	console.log("sum * winning:", sumOfUnmarked * result.bingo.row.winningNumber);
}

function drawNumbers(numbers, boards) {
	let bingo;
	let lastWonBingo;
	let hasBingoWon = false;
	const markedNumbers = [];
	let unmarkedNumbers;
	for (let number of numbers) {
		markedNumbers.push(number);
		for (let board of boards) {
			bingo = findBingo(board, number);
			if (bingo.row) {
				hasBingoWon = true;
				lastWonBingo = bingo;
			} else {
				hasBingoWon = false;
			}
			if (hasBingoWon && (!findLast || boards.filter((board) => board.hasWon).length == boards.length)) {
				break;
			} 
		}
		if (hasBingoWon) {
			unmarkedNumbers = findUnmarkedNumbers(lastWonBingo.board.horizontalRows, [...new Set(lastWonBingo.board.winningMarkedNumbers)]);
			if (!findLast || boards.filter((board) => board.hasWon).length == boards.length) {
				break;
			}
		}
	}
	return { bingo: lastWonBingo, unmarkedNumbers };
}

function findUnmarkedNumbers(rows, markedNumbers) {
	const flattenedNumbers = rows.map((item) => item.row).flat();
	const unmarkedNumbers = [];
	for (let i = 0; i < flattenedNumbers.length; i++) {
		let number = flattenedNumbers[i];
		if (!markedNumbers.includes(number)) {
			unmarkedNumbers.push(number);
		}
	}
	return unmarkedNumbers;
}

function findBingo(board, number) {
	const bingo = {
		board: null,
		row: null,
		rowType: "",
	};
	for (let rowType of ["horizontalRows", "verticalRows"]) {
		let drawnRows = drawNumber(board, board[rowType], number);
		board[rowType] = drawnRows;
		let bingoRow = drawnRows.filter((item) => item.hasBingo);
		if (bingoRow.length > 0) {
			board.hasWon = true;
			bingo.board = board;
			bingo.row = bingoRow[0];
			bingo.rowType = rowType;
			if (!findLast) {
				break;
			}
		}
	}
	return bingo;
}

function drawNumber(board, rows, number) {
	for (let i in rows) {
		let row = rows[i];
		if (row.drawnCount === row.row.length) {
			continue;
		}
		if (row.row.includes(number)) {
			board.markedNumbers.push(number);
			row.drawnCount++;
		}
		if (row.drawnCount === row.row.length) {
			row.hasBingo = true;
			row.winningNumber = number;
			row.winningRowIndex = parseInt(i);
			board.winningMarkedNumbers = board.markedNumbers;
			if (!findLast) {
				break;
			}
		}
	}
	return rows;
}

function Board(rawBoard) {
	const horizontalRows = [],
		verticalRows = [];
	for (let row of rawBoard) {
		horizontalRows.push({
			row,
			drawnCount: 0,
			hasBingo: false,
			winningNumber: 0,
			winningRowIndex: null,
		});
	}
	for (let row of transposeArray(rawBoard)) {
		verticalRows.push({
			row,
			drawnCount: 0,
			hasBingo: false,
			winningNumber: 0,
			winningRowIndex: null,
		});
	}
	return {
		markedNumbers: [],
		horizontalRows,
		verticalRows,
	};
}

function transposeArray(array) {
	const transposedArray = [];
	array.forEach((item, i) => {
		item = item.trim ? item.trim() : item;
		for (let j = 0; j < item.length; j++) {
			let char = item[j].trim ? item[j].trim() : item[j];
			if (!transposedArray[j]) {
				transposedArray[j] = [];
			}
			transposedArray[j].push(char);
		}
	});
	return transposedArray;
}
